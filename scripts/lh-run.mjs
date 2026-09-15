import { mkdirSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

const variant = process.argv[2];
if (!variant) {
  console.error("usage: node scripts/lh-run.mjs <variant> [mobileRuns] [desktopRuns]");
  process.exit(1);
}
const mobileRuns = Number(process.argv[3] ?? 5);
const desktopRuns = Number(process.argv[4] ?? 3);

if (!existsSync("dist/index.html")) {
  console.error("dist/index.html missing — build first");
  process.exit(1);
}

mkdirSync("/tmp/lh", { recursive: true });

function run(form, n) {
  const flags = form === "desktop" ? "--preset=desktop" : "--preset=perf";
  const out = `/tmp/lh/${variant}-${form}-${n}.json`;
  const cmd = [
    "npx lighthouse http://127.0.0.1:4174/",
    "--quiet",
    '--chrome-flags="--headless=new"',
    "--only-categories=performance",
    flags,
    `--output=json --output-path=${out}`,
  ].join(" ");
  console.log(`[${variant}-${form}-${n}] running...`);
  execSync(cmd, { stdio: ["ignore", "ignore", "inherit"], shell: "/bin/bash" });
}

let n = 1;
for (let i = 0; i < mobileRuns; i++) run("mobile", n++);
for (let i = 0; i < desktopRuns; i++) run("desktop", n++);
console.log(`done: ${mobileRuns} mobile + ${desktopRuns} desktop for ${variant}`);
