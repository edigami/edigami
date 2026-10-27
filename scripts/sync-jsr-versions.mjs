// Changesets only bumps package.json. Copy each package's version into its
// jsr.json so npm and JSR publish the same version.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const packagesDir = new URL("../packages/", import.meta.url);

for (const name of readdirSync(packagesDir)) {
  const dir = new URL(`${name}/`, packagesDir);
  const jsrPath = new URL("jsr.json", dir);
  if (!existsSync(jsrPath)) continue;

  const { version } = JSON.parse(
    readFileSync(new URL("package.json", dir), "utf8"),
  );
  const jsr = JSON.parse(readFileSync(jsrPath, "utf8"));
  if (jsr.version === version) continue;

  jsr.version = version;
  writeFileSync(jsrPath, `${JSON.stringify(jsr, null, 2)}\n`);
  console.log(`${join("packages", name, "jsr.json")}: ${version}`);
}
