const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts.js');
const LoginHelpers = require('../e2e/login-helpers');

// this test verifies that unauthenticated users and LOA1 users
// do not have access to the app
module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();
    const appURL = `${E2eHelpers.baseUrl}/healthcare/prescriptions`;

    LoginHelpers.initLogoutMock(token);

    client
      .url(appURL)
      .waitForElementVisible('body', Timeouts.normal)
      .assert.title('Refill your prescriptions: Vets.gov');

    client
      .waitForElementVisible('.react-container', Timeouts.normal)
      .expect.element('h1').text.to.equal('Sign In to Your Vets.gov Account');


    LoginHelpers.logIn(token, client, '/healthcare/prescriptions', 1)
      .waitForElementVisible('.react-container', Timeouts.normal)
      .expect.element('h1').text.to.equal('Verify your Identity with ID.me');
    client.
      expect.element('button.usa-button-big').text.to.equal('Get Started');

    client.end();
  }
);
