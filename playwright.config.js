const { defineConfig } = require("@playwright/test");
const port = process.env.TEST_PORT || "8081";
const baseURL = `http://localhost:${port}`;
module.exports = defineConfig({
  testDir: "./tests",
  use: {
    baseURL,
    launchOptions: {
      executablePath:
        process.env.CHROMIUM_PATH ||
        (require("node:fs").existsSync("/usr/bin/chromium")
          ? "/usr/bin/chromium"
          : undefined),
      args: ["--no-sandbox"],
    },
  },
  webServer: {
    command: `npm run dev -- --port=${port}`,
    url: baseURL,
    reuseExistingServer: false,
  },
});
