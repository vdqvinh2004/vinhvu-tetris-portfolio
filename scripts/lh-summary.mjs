import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

const dir = process.argv[2] ?? "/tmp/lh";
// numericValue in Lighthouse JSON is milliseconds (scores are 0..1).
const metrics = [
  ["FCP", "first-contentful-paint"],
  ["LCP", "largest-contentful-paint"],
  ["TBT", "total-blocking-time"],
  ["CLS", "cumulative-layout-shift"],
  ["SI", "speed-index"],
];
const SPREAD = new Set(["FCP", "LCP", "TBT", "SI"]);

const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
const groups = new Map();
for (const file of files) {
  // <variant>-<formfactor>-<run>.json
  const m = basename(file).match(/^([a-z0-9]+)-(mobile|desktop)-(\d+)\.json$/);
  if (!m) continue;
  const key = `${m[1]}-${m[2]}`;
  const report = JSON.parse(readFileSync(join(dir, file), "utf8"));
  const a = report.audits;
  const row = { file };
  for (const [label, id] of metrics) row[label] = a[id]?.numericValue;
  row["Perf"] = report.categories.performance.score * 100;
  row["KB total"] = a["total-byte-weight"].numericValue / 1024;
  row["JS kB"] = jsKb(report);
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(row);
}

function jsKb(report) {
  const items = report.audits?.["network-requests"]?.details?.items ?? [];
  const js = items
    .filter((i) => /\.js(\?|$)/.test(i.url) && /assets\//.test(i.url))
    .map((i) => i.transferSize);
  return Math.round(js.reduce((s, v) => s + v, 0) / 1024);
}

const median = (arr) => {
  const s = [...arr].sort((x, y) => x - y);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};
const fmt = (v) =>
  v === undefined || v === null || Number.isNaN(v) ? "n/a" : Math.round(v * 100) / 100;

const summary = {};
for (const [key, rows] of groups) {
  const med = {};
  for (const label of [...metrics.map(([l]) => l), "Perf", "KB total", "JS kB"]) {
    med[label] = median(rows.map((r) => r[label]));
  }
  med._minmax = {};
  for (const [label] of metrics) {
    if (SPREAD.has(label)) {
      const vals = rows.map((r) => r[label]).filter((v) => typeof v === "number");
      med._minmax[label] = vals.length ? [Math.min(...vals), Math.max(...vals)] : undefined;
    }
  }
  summary[key] = med;
  console.log(`\n${key} (${rows.length} runs)`);
  console.log(
    `  median: ` +
      metrics
        .map(([l]) => {
          const base = `${l} ${fmt(med[l])}ms`;
          if (!SPREAD.has(l)) return base;
          const mm = med._minmax[l];
          return mm ? `${base} (${fmt(mm[0])}–${fmt(mm[1])})` : base;
        })
        .join(" | ") +
      ` | perf ${fmt(med["Perf"])} | total ${Math.round(med["KB total"])} kB | JS ${fmt(med["JS kB"])} kB`,
  );
}

// Per form factor: variants side by side, deltas vs before.
const ORDER = ["before", "splitonly", "after", "final"];
for (const form of ["mobile", "desktop"]) {
  const b = summary[`before-${form}`];
  const variants = Object.keys(summary)
    .filter((k) => k.endsWith(`-${form}`))
    .map((k) => k.slice(0, -(form.length + 1)))
    .sort((x, y) => {
      const ix = ORDER.indexOf(x);
      const iy = ORDER.indexOf(y);
      return (ix === -1 ? 99 : ix) - (iy === -1 ? 99 : iy);
    });
  if (!variants.length) continue;
  console.log(`\n=== ${form} (median ms, min–max where shown) ===`);
  for (const [label] of metrics) {
    const line = variants
      .map((v) => {
        const s = summary[`${v}-${form}`];
        const val = s[label];
        let cell = `${v} ${fmt(val)}`;
        if (SPREAD.has(label) && s._minmax[label])
          cell += ` (${fmt(s._minmax[label][0])}–${fmt(s._minmax[label][1])})`;
        if (v !== "before" && b && typeof b[label] === "number" && typeof val === "number") {
          const d = val - b[label];
          cell += ` Δ${d >= 0 ? "+" : ""}${fmt(d)}`;
        }
        return cell;
      })
      .join("  |  ");
    console.log(`${label.padEnd(5)} ${line}`);
  }
}
