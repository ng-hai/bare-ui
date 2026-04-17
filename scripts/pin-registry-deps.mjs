#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const repoRoot = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));

const pins = new Map(
  Object.entries(pkg.dependencies ?? {}).map(([name, version]) => [name, `${name}@^${version}`]),
);

function rewrite(deps) {
  if (!Array.isArray(deps)) return { deps, changed: false };
  let changed = false;
  const next = deps.map((dep) => {
    const pinned = pins.get(dep);
    if (pinned && pinned !== dep) {
      changed = true;
      return pinned;
    }
    return dep;
  });
  return { deps: next, changed };
}

const registryDir = path.join(repoRoot, "public", "r");
const files = fs.readdirSync(registryDir).filter((f) => f.endsWith(".json"));

const pinned = new Set();
let totalChanged = 0;
for (const file of files) {
  const filePath = path.join(registryDir, file);
  const entry = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let changed = false;

  const applyTo = (obj) => {
    if (!obj?.dependencies) return;
    const { deps, changed: c } = rewrite(obj.dependencies);
    if (c) {
      for (const d of deps) if (d.includes("@^")) pinned.add(d);
      obj.dependencies = deps;
      changed = true;
    }
  };

  applyTo(entry);
  if (Array.isArray(entry.items)) for (const item of entry.items) applyTo(item);

  if (changed) {
    fs.writeFileSync(filePath, `${JSON.stringify(entry, null, 2)}\n`);
    totalChanged++;
  }
}

const summary = pinned.size > 0 ? [...pinned].sort().join(", ") : "nothing to pin";
console.log(`pin-deps: rewrote ${totalChanged} file(s) — ${summary}`);
