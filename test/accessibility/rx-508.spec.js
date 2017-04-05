const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts.js');
const RxHelpers = require('../e2e/rx-helpers');
const LoginHelpers = require('../e2e/login-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();

    RxHelpers.initApplicationSubmitMock(token);

    // Ensure active page renders.
    LoginHelpers.logIn(token, client, '/healthcare/prescriptions', 3)
      .waitForElementVisible('body', Timeouts.normal)
      .axeCheck('.main');

    E2eHelpers.overrideSmoothScrolling(client);

    // Ensure history page renders.
    client
      .url(`${E2eHelpers.baseUrl}/healthcare/prescriptions/history`)
      .waitForElementVisible('body', Timeouts.normal)
      .axeCheck('.main');

    // Ensure detail page renders.
    client
      .url(`${E2eHelpers.baseUrl}/healthcare/prescriptions/13499271`)
      .waitForElementVisible('body', Timeouts.normal)
      .axeCheck('.main');

    // Ensure glossary page renders.
    client
      .url(`${E2eHelpers.baseUrl}/healthcare/prescriptions/glossary`)
      .waitForElementVisible('body', Timeouts.normal)
      .axeCheck('.main');
  }
);

