const E2eHelpers = require('../e2e/e2e-helpers');
const LettersHelpers = require('../e2e/letters-helpers.js');
const LoginHelpers = require('../e2e/login-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();

    LettersHelpers.initApplicationMock(token);

    // Test flow for unauthed and LOA1 users
    LoginHelpers.testUnauthedUserFlow(client, '/letters');

    client.axeCheck('.main');

    client.end();
  }
);
