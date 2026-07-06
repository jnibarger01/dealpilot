import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const sourceRoots = ["apps", "packages"];
const roots = [...sourceRoots, "tests", "tools"];
const banned = [
  /\bPursue\b/i,
  /\bPass\b/i,
  /\bBuy now\b/i,
  /\brecommend(?:ation|ed|s)?\b/i,
  /hallucination-free/i,
  /never invent facts/i,
];
const requiredModules = [
  "contracts",
  "ingestion",
  "claims",
  "evidence",
  "adjudication",
  "memo",
  "ledger",
];

function walk(dir) {
  let out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) out = out.concat(walk(path));
    else out.push(path);
  }
  return out;
}

const files = roots
  .flatMap((root) => {
    try {
      return walk(root);
    } catch {
      return [];
    }
  })
  .filter((path) => /\.(ts|mjs|json|md)$/.test(path));

const errors = [];
for (const file of files) {
  const text = readFileSync(file, "utf8");
  const isSource = sourceRoots.some(
    (root) => file === root || file.startsWith(`${root}/`),
  );
  if (isSource) {
    for (const pattern of banned) {
      if (pattern.test(text)) {
        errors.push(`${file}: banned perimeter language matched ${pattern}`);
      }
    }
  }
  if (/\.ts$/.test(file) && /(:\s*any\b|\bas\s+any\b|<any>)/.test(text)) {
    errors.push(`${file}: avoid TypeScript any; use unknown and narrowing`);
  }
}
for (const mod of requiredModules) {
  try {
    statSync(join("packages", mod));
  } catch {
    errors.push(`missing required module packages/${mod}`);
  }
}
try {
  statSync(join("apps", "api"));
} catch {
  errors.push("missing required module apps/api");
}
try {
  statSync(join("apps", "ui"));
} catch {
  errors.push("missing required module apps/ui");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("implementation lint: CLEAN");
