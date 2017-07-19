const E2eHelpers = require('../e2e/e2e-helpers');
const GibsHelpers = require('../e2e/post-911-gib-status-helpers.js');
const LoginHelpers = require('../e2e/login-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();

    GibsHelpers.initApplicationMock(token);

    // Test flow for unauthed and LOA1 users
    LoginHelpers.testUnauthedUserFlow(client, '/education/gi-bill/post-9-11/ch-33-benefit');

    client.axeCheck('.main');

    client.end();
  }
);
