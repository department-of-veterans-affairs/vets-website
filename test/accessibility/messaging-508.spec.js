const E2eHelpers = require('../util/e2e-helpers');
const Timeouts = require('../util/timeouts.js');
const LoginHelpers = require('../util/login-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();

    // Ensure active page renders.
    LoginHelpers.logIn(token, client, '/healthcare/messaging', 3)
      .url(`${E2eHelpers.baseUrl}/healthcare/messaging`)
      .waitForElementVisible('body', Timeouts.normal)
      .axeCheck('.main');

    // Ensure history page renders.
    client
      .url(`${E2eHelpers.baseUrl}/healthcare/messaging/folder/0`)
      .waitForElementVisible('body', Timeouts.normal)
      .axeCheck('.main');

    // Ensure detail page renders.
    client
      .url(`${E2eHelpers.baseUrl}/healthcare/messaging/compose`)
      .waitForElementVisible('body', Timeouts.normal)
      .axeCheck('.main');

    // Ensure glossary page renders.
    client
      .url(`${E2eHelpers.baseUrl}/healthcare/messaging/settings`)
      .waitForElementVisible('body', Timeouts.normal)
      .axeCheck('.main');
  }
);

