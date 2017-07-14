const E2eHelpers = require('../e2e/e2e-helpers');
const LoginHelpers = require('../e2e/login-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    // Test flow for unauthed and LOA1 users
    LoginHelpers.testUnauthedUserFlow(client, '/health-care/health-records');

    client.end();
  }
);
