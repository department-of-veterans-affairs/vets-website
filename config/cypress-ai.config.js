/**
 * AI-optimized Cypress configuration.
 *
 * Overrides the default config with settings tuned for fast, informative
 * feedback when an AI agent runs Cypress tests:
 *
 *  - Retries disabled (fail fast instead of re-running 2x)
 *  - Video disabled (saves encoding time)
 *  - Shorter timeouts (surface hangs quickly)
 *  - Screenshot on failure kept (useful artifact)
 *
 * Usage:
 *   yarn cy:run:ai --spec "src/applications/my-app/tests/my.cypress.spec.js"
 *
 * Or directly:
 *   node script/run-cypress-ai.js --spec "src/applications/my-app/tests/my.cypress.spec.js"
 */

const { defineConfig } = require('cypress');
const { TEST_SERVER_BASE_URL } = require('./test-server.config');

// Import the base config to inherit viewport presets, env, etc.
const baseExports = require('./cypress.config');

// Extract the base cypressConfig by stripping defineConfig wrapper keys
// We rebuild from the pieces we need.
const aiConfig = defineConfig({
  // Inherit most base settings
  viewportWidth: 1920,
  viewportHeight: 1080,
  modifyObstructiveCode: false,
  fixturesFolder: 'src',
  waitForAnimations: false,
  chromeWebSecurity: false,
  includeShadowDom: true,

  // --- AI-optimized overrides ---
  video: false, // No video — saves ~5-10s per spec
  screenshotOnRunFailure: true, // Keep screenshots for debugging

  retries: {
    runMode: 0, // Fail fast — no retries
    openMode: 0,
  },

  // Tighter timeouts to surface hangs quickly
  defaultCommandTimeout: 8000, // 8s (default: 4s, bumped slightly for VA apps)
  pageLoadTimeout: 20000, // 20s (default: 60s)
  requestTimeout: 8000, // 8s (default: 5s)
  responseTimeout: 20000, // 20s (default: 30s)
  taskTimeout: 15000, // 15s (default: 60s)

  // Inherit env from base
  env: baseExports.env || {},

  e2e: {
    setupNodeEvents(on, config) {
      return require('../src/platform/testing/e2e/cypress/plugins/index')(
        on,
        config,
      );
    },
    baseUrl: TEST_SERVER_BASE_URL,
    specPattern: 'src/**/tests/**/*.cypress.spec.js?(x)',
    supportFile: 'src/platform/testing/e2e/cypress/support/ai-support.js',
    includeShadowDom: true,
  },
});

module.exports = {
  ...aiConfig,
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
  },
};
