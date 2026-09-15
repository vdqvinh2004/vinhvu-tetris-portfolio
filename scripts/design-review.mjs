import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.env.REVIEW_BASE ?? "http://127.0.0.1:4173";
const VIEWPORTS = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "laptop-1024", width: 1024, height: 768 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-320", width: 320, height: 568 },
];

// Each route is checked at every viewport. `sceneSelector` proves the lazily
// imported Three.js chunk still mounts a canvas after the code split.
const ROUTES = [
  { name: "game", path: "/", sceneSelector: ".game-scene canvas" },
  { name: "portfolio", path: "/portfolio", sceneSelector: ".portfolio-scene canvas" },
];

const SELECTORS = [
  ".game-console",
  ".play-header h1",
  ".skip-button",
  ".play-hud",
  ".hud-stat",
  ".next-piece-panel",
  ".challenge-playfield",
  ".game-board",
  ".how-to-play",
  ".game-status",
  ".game-controls",
  ".game-launch",
];

mkdirSync("test-results/design-review", { recursive: true });
const report = {
  generatedAt: new Date().toISOString(),
  base: BASE,
  viewports: {},
};
let sceneFailures = 0;

const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  report.viewports[vp.name] = {};

  for (const route of ROUTES) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto(new URL(route.path, BASE).href);
    await page.waitForTimeout(400);

    // --- Scene canvas check (the code-split regression probe) ---
    let scene;
    try {
      const canvas = await page.waitForSelector(route.sceneSelector, { timeout: 15000 });
      const rect = await canvas.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height) };
      });
      scene = { attached: true, ...rect };
    } catch {
      scene = { attached: false };
      sceneFailures += 1;
    }

    if (route.name === "portfolio") {
      await page.screenshot({
        path: `test-results/design-review/${vp.name}-portfolio.png`,
        fullPage: true,
      });
      report.viewports[vp.name].portfolio = { scene };
      await page.close();
      continue;
    }

    // --- Game route: full geometry/contrast/touch audit ---
    const audit = await page.evaluate((selectors) => {
      const visible = (el) => {
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0)
          return false;
        const rect = el.getBoundingClientRect();
        return rect.width > 1 && rect.height > 1;
      };
      const data = {};
      for (const selector of selectors) {
        const nodes = [...document.querySelectorAll(selector)].filter(visible);
        data[selector] = nodes.map((el) => {
          const rect = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          return {
            rect: {
              x: Math.round(rect.x),
              y: Math.round(rect.y),
              w: Math.round(rect.width),
              h: Math.round(rect.height),
            },
            color: style.color,
            backgroundColor: style.backgroundColor,
            borderColor: style.borderColor,
            fontSize: style.fontSize,
            overflow: {
              horizontal: rect.right > window.innerWidth + 1 || rect.left < -1,
              vertical: rect.bottom > window.innerHeight + 1 || rect.top < -1,
            },
          };
        });
      }
      return {
        root: {
          scrollHeight: document.documentElement.scrollHeight,
          innerHeight: window.innerHeight,
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
        },
        elements: data,
      };
    }, SELECTORS);

    const contrastChecks = await page.evaluate(() => {
      const parseRgb = (raw) => {
        const m = raw.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        return m[1]
          .split("/")[0]
          .replace(/,/g, " ")
          .trim()
          .split(/\s+/)
          .map(Number);
      };
      const lum = (rgb) => {
        const [r, g, b] = rgb.map((v) => {
          const s = v / 255;
          return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const effectiveBg = (el) => {
        for (let node = el; node && node !== document.documentElement; node = node.parentElement) {
          const bg = getComputedStyle(node).backgroundColor;
          const rgb = parseRgb(bg);
          if (rgb && (rgb.length < 4 || rgb[3] > 0.85)) return bg;
        }
        return "rgb(9, 9, 9)";
      };
      const out = [];
      const probes = [
        { label: "header title", el: document.querySelector(".play-header h1") },
        { label: "tagline", el: document.querySelector(".play-tagline") },
        { label: "skip button", el: document.querySelector(".skip-button") },
        { label: "hud label", el: document.querySelector(".hud-label") },
        { label: "hud value", el: document.querySelector(".hud-value") },
        { label: "how-to-play heading", el: document.querySelector(".how-to-play h2") },
        { label: "how-to-play text", el: document.querySelector(".how-to-play p") },
        { label: "legend key", el: document.querySelector(".key-legend dt") },
        { label: "legend action", el: document.querySelector(".key-legend dd") },
        { label: "status line", el: document.querySelector(".game-status") },
      ];
      for (const { label, el } of probes) {
        if (!el) {
          out.push({ label, present: false });
          continue;
        }
        const fg = getComputedStyle(el).color;
        const bg = effectiveBg(el);
        const fgRgb = parseRgb(fg);
        const bgRgb = parseRgb(bg);
        const ratio =
          fgRgb && bgRgb
            ? (Math.max(lum(fgRgb), lum(bgRgb)) + 0.05) / (Math.min(lum(fgRgb), lum(bgRgb)) + 0.05)
            : null;
        out.push({
          label,
          present: true,
          fg,
          bg,
          ratio: ratio ? Math.round(ratio * 100) / 100 : null,
        });
      }
      return out;
    });

    const touchTargets = await page.evaluate(() =>
      [...document.querySelectorAll("button")].map((b) => {
        const rect = b.getBoundingClientRect();
        return {
          name: (b.getAttribute("aria-label") || b.textContent || "").trim().slice(0, 30),
          w: Math.round(rect.width),
          h: Math.round(rect.height),
        };
      }),
    );

    await page.screenshot({
      path: `test-results/design-review/${vp.name}.png`,
      fullPage: true,
    });

    report.viewports[vp.name].game = { scene, audit, contrastChecks, touchTargets };
    await page.close();
  }
}

await browser.close();
writeFileSync("test-results/design-review/report.json", JSON.stringify(report, null, 2));

for (const [name, routes] of Object.entries(report.viewports)) {
  console.log(`\n=== ${name} ===`);
  for (const [routeName, data] of Object.entries(routes)) {
    if (routeName === "portfolio") {
      console.log(
        `portfolio scene: ${data.scene.attached ? `canvas ${data.scene.w}x${data.scene.h}` : "NOT ATTACHED"}`,
      );
      continue;
    }
    const { scene, audit, contrastChecks, touchTargets } = data;
    const { scrollHeight, innerHeight, scrollWidth, innerWidth } = audit.root;
    console.log(
      `game scene: ${scene.attached ? `canvas ${scene.w}x${scene.h}` : "NOT ATTACHED"}`,
    );
    console.log(
      `page: ${scrollHeight}/${innerHeight}vh tall, ${scrollWidth}/${innerWidth}px wide -> overflow ${scrollHeight - innerHeight}px v / ${scrollWidth - innerWidth}px h`,
    );
    for (const [selector, nodes] of Object.entries(audit.elements)) {
      if (!nodes.length) continue;
      const n = nodes[0];
      const flags = [
        n.overflow.horizontal ? "H-OVERFLOW" : "",
        n.overflow.vertical ? "V-OVERFLOW" : "",
      ]
        .filter(Boolean)
        .join(" ");
      console.log(
        `${selector}  ${n.rect.w}x${n.rect.h} @(${n.rect.x},${n.rect.y}) fs=${n.fontSize} ${flags}`,
      );
    }
    const low = contrastChecks.filter((c) => c.present && c.ratio !== null && c.ratio < 4.5);
    console.log(
      `contrast: ${contrastChecks.filter((c) => c.present && c.ratio >= 4.5).length}/${contrastChecks.filter((c) => c.present).length} >= 4.5${low.length ? " LOW -> " + low.map((c) => `${c.label} ${c.ratio}`).join(", ") : ""}`,
    );
    const small = touchTargets.filter((t) => t.h > 0 && (t.h < 44 || t.w < 44));
    if (small.length) {
      console.log(`touch < 44px: ${small.map((t) => `"${t.name}" ${t.w}x${t.h}`).join(", ")}`);
    } else {
      console.log("touch targets: all >= 44px");
    }
  }
}

console.log(`\nscene failures: ${sceneFailures}`);
if (sceneFailures > 0) process.exitCode = 1;
