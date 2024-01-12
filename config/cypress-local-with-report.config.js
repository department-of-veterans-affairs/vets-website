const { defineConfig } = require('cypress');

const cypressConfig = require('./cypress.config');
const reporterConfig = require('./cypress-reporters');

const configWithReporting = {
  ...cypressConfig,
  e2e: {
    ...cypressConfig.e2e,
  },
  reporter: 'mochawesome',
  reporterConfig: {
    ...reporterConfig.mochawesomeReporterOptions,
  },
};

module.exports = defineConfig(configWithReporting);
