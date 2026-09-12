const { defineConfig } = require("@playwright/test");
module.exports = defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://localhost:8080",
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
    command: "npm run dev",
    url: "http://localhost:8080",
    reuseExistingServer: false,
  },
});
