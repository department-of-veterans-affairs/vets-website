const Auth = require('../../../../platform/testing/e2e/auth');
const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../platform/testing/e2e/timeouts');
const fillForm = require('./form-filler');

const runTest = (client, testData, testConfig) => {
  const authToken = Auth.getUserToken();
  if (testConfig.setup && typeof testConfig.setup === 'function') {
    testConfig.setup(client, testConfig, testData, authToken);
  }

  // Login (if needed) and navigate to the starting URL
  if (testConfig.logIn) {
    Auth.logIn(authToken, client, testConfig.url, 3);
  } else {
    client
      .openUrl(`${E2eHelpers.baseUrl}${testConfig.url}`)
      .waitForElementVisible('body', Timeouts.normal);
  }

  // Fill out the whole form
  fillForm(client, testData, testConfig);

  // TODO: Check for unused data
  // TODO: Submit
  //   - Configurable; we may not always want to submit
};

module.exports = runTest;
