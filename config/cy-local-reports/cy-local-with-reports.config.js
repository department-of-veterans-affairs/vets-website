const { defineConfig } = require('cypress');

const cypressConfig = require('../cypress.config');

const configWithReporting = {
  ...cypressConfig,
  e2e: {
    ...cypressConfig.e2e,
    video: false,
  },
  reporter: 'config/cy-local-reports/LocalReporter.js',
  reporterOptions: {
    overwrite: false,
    html: true,
    json: true,
  },
};

module.exports = defineConfig(configWithReporting);
