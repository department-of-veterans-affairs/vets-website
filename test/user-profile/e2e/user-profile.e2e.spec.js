const E2eHelpers = require('../../e2e/e2e-helpers');
const Timeouts = require('../../e2e/timeouts.js');
const LoginHelpers = require('../../e2e/login-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    let token = LoginHelpers.getUserToken();

    LoginHelpers.logIn(token, client, '/profile', 1)
      // The loading indicator tests seem to be problematic because the thing goes away fairly quickly
      // it seems to have already disappeared by the time the test starts looking for it.
      // .waitForElementVisible('.loading-indicator-container', Timeouts.normal)
      // .waitForElementNotPresent('.loading-indicator-container', Timeouts.slow)
      // .waitForElementVisible('.usa-button-big', Timeouts.normal)
      .axeCheck('document');

    token = LoginHelpers.getUserToken();

    LoginHelpers
      .logIn(token, client, '/profile', 3)
      .waitForElementVisible('.section-header', Timeouts.normal)
      .axeCheck('document');

    client.end();
  });
