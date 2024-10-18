const productInput = process.env.TARGET_APP_INTEGRATION_TEST;

function integrationHelper() {
  process.env.INTEGRATION_APP_PATH = `src/applications/${productInput}/**/*.cypress.spec.js`;
  return process.env.INTEGRATION_APP_PATH;
}

module.exports = integrationHelper;
