const E2eHelpers = require('../../src/platform/testing/e2e/helpers');
const Timeouts = require('../../src/platform/testing/e2e/timeouts.js');
const LoginHelpers = require('../e2e/login-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();
    const logoutUrl = LoginHelpers.getLogoutUrl();

    // log in & wait for little person icon to appear next to the username
    LoginHelpers.logIn(token, client, '/', 3)
      .assert.title('Vets.gov')
      .waitForElementVisible('#login-root button[aria-controls="accountMenu"]', Timeouts.slow);

    // click dropdown on username
    client.click('#login-root button[aria-controls="accountMenu"]');

    // logout button is there
    client.expect.element('#accountMenu > ul > li:nth-child(2) > a').to.be.visible;

    // log out button reads "Sign Out"
    client.expect.element('#accountMenu > ul > li:nth-child(2) > a').text.to.equal('Sign Out');

    // click Sign Out & verify new window is opened & has correct logout URL
    client
      .click('#accountMenu > ul > li:nth-child(2) > a')
      .pause(500)
      .windowHandles(function windowHandlesCallback(result) {
        this.verify.equal(result.value.length, 2, 'There should be 2 windows open');
        const newWindow = result.value[1];
        this.switchWindow(newWindow);
        this.verify.urlContains(logoutUrl);
      });

    client.end();
  }
);
