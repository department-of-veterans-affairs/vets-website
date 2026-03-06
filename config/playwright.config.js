const path = require('path');
const { defineConfig, devices } = require('@playwright/test');
const { TEST_SERVER_BASE_URL } = require('./test-server.config');

const rootDir = path.resolve(__dirname, '..');

module.exports = defineConfig({
  testDir: path.join(rootDir, 'src'),
  testMatch: '**/*.playwright.spec.js',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: process.env.CI
    ? [['html', { open: 'never' }], ['list']]
    : [['list']],
  timeout: 60_000,

  use: {
    baseURL: TEST_SERVER_BASE_URL,
    viewport: { width: 1920, height: 1080 },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command:
      'node src/platform/testing/e2e/test-server.js --buildtype=localhost --port=3001 --host=127.0.0.1',
    cwd: rootDir,
    url: TEST_SERVER_BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
