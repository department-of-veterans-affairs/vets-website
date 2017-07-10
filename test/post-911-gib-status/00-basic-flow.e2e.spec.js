const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts.js');
const GibsHelpers = require('../e2e/post-911-gib-status-helpers.js');
const LoginHelpers = require('../e2e/login-helpers');
const AccountCreationHelpers = require('../e2e/account-creation-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();

    GibsHelpers.initApplicationMock(token);

    AccountCreationHelpers.initMHVTermsMocks(token);

    // Test flow for unauthed and LOA1 users
    LoginHelpers.testUnauthedUserFlow(client, '/education/gi-bill/post-9-11/ch-33-benefit');

    // Ensure main status page renders.
    LoginHelpers.logIn(token, client, '/education/gi-bill/post-9-11/ch-33-benefit', 3)
      .waitForElementVisible('body', Timeouts.normal)
      .axeCheck('.main')
      .assert.title('Check Benefit: Vets.gov')
      .waitForElementVisible('.schemaform-title', 10000);  // First render of React may be slow.

    // // User information section
    // client
    //   .expect.element('[name="fullName"]').text.to.contain('First Last');

    client.axeCheck('.main');

    client.end();
  }
);
