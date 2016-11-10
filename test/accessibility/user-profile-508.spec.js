const E2eHelpers = require('../util/e2e-helpers');
const Timeouts = require('../util/timeouts.js');
const LoginHelpers = require('../util/login-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    LoginHelpers.logIn(client, '/profile', 1);

    client
      .url(`${E2eHelpers.baseUrl}/profile`)
      .waitForElementVisible('body', Timeouts.normal)
      .axeCheck('document');

    LoginHelpers.logIn(client, '/profile', 3);

    client
      .url(`${E2eHelpers.baseUrl}/profile`)
      .waitForElementVisible('body', Timeouts.normal)
      .axeCheck('document');

    client.end();
  });
