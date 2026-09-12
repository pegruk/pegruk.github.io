const { rmSync } = require("node:fs");
const { spawnSync } = require("node:child_process");
rmSync("_site", { recursive: true, force: true });
const result = spawnSync(
  process.execPath,
  ["node_modules/@11ty/eleventy/cmd.cjs"],
  {
    stdio: "inherit",
    env: { ...process.env, ELEVENTY_ENV: "production" },
  },
);
process.exit(result.status ?? 1);
