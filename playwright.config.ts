import { defineConfig } from "@playwright/test";

export default defineConfig({
  webServer: {
    command: "npm run build && npm run preview",
    port: 5173,
    reuseExistingServer: true,
  },
  testDir: "./tests",
  use: {
    baseURL: "http://localhost:5173",
    testIdAttribute: "data-test-id",
  },
});
