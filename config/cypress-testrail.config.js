const { defineConfig } = require('cypress');

const cypressConfig = {
  viewportWidth: 1920,
  viewportHeight: 1080,
  modifyObstructiveCode: false,
  fixturesFolder: 'src',
  waitForAnimations: false,
  chromeWebSecurity: false,
  reporter: '@tlei123/vagov-cy-tr-reporter',
  reporterOptions: {
    host: 'https://dsvavsp.testrail.io/',
    username: 'TR_USER',
    password: 'TR_API_KEY',
    projectId: 'TR_PROJECTID',
    suiteId: 'TR_SUITEID',
    runName: 'TR_RUN_NAME',
    includeAllInTestRun: 'TR_INCLUDE_ALL',
    groupId: 'TR_GROUPID',
    filter: 'TR_FILTER',
  },
  e2e: {
    setupNodeEvents(on, config) {
      return require('../src/platform/testing/e2e/cypress/plugins/index')(
        on,
        config,
      );
    },
    baseUrl: 'http://localhost:3001',
    specPattern: 'src/**/tests/**/*.cypress.spec.js?(x)',
    supportFile: 'src/platform/testing/e2e/cypress/support/index.js',
  },
  video: false,
};

module.exports = defineConfig(cypressConfig);
