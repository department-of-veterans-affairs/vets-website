const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts.js');
const LoginHelpers = require('../e2e/login-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    let token = LoginHelpers.getUserToken();

    LoginHelpers.logIn(token, client, '/profile', 1)
      .waitForElementVisible('body', Timeouts.normal)
      .axeCheck('document');

    token = LoginHelpers.getUserToken();

    LoginHelpers.logIn(token, client, '/profile', 3)
      .waitForElementVisible('body', Timeouts.normal)
      .axeCheck('document');

    client.end();
  });
