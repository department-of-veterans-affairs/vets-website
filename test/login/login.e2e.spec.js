const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts.js');
const LoginHelpers = require('../e2e/login-helpers');

const selectors = {
  menu: '#login-root button[aria-controls="accountMenu"]',
  signOut: '#accountMenu > ul > li:nth-child(4) > a'
};

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();
    const logoutUrl = LoginHelpers.getLogoutUrl();

    // log in & wait for little person icon to appear next to the username
    LoginHelpers.logIn(token, client, '/', 3)
      .assert.title('Vets.gov')
      .waitForElementVisible(selectors.menu, Timeouts.slow);

    // click dropdown on username
    client.click(selectors.menu);

    // logout button is there
    client.expect.element(selectors.signOut).to.be.visible;

    // log out button reads "Sign Out"
    client.expect.element(selectors.signOut).text.to.equal('Sign Out');

    // click Sign Out & verify new window is opened & has correct logout URL
    client
      .click(selectors.signOut)
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
