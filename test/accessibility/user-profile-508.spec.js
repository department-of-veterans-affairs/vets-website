const E2eHelpers = require('../util/e2e-helpers');
const Timeouts = require('../util/timeouts.js');
const LoginHelpers = require('../util/login-helpers');

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
