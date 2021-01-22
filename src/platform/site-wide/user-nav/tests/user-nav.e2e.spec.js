const E2eHelpers = require('../../../testing/e2e/helpers');
const Timeouts = require('../../../testing/e2e/timeouts.js');
const Auth = require('../../../testing/e2e/auth');

const selectors = {
  menu: '#login-root button[aria-controls="account-menu"]',
  signOut: '#account-menu > ul > li:nth-child(4) > a',
};

module.exports = E2eHelpers.createE2eTest(client => {
  const token = Auth.getUserToken();

  // log in & wait for little person icon to appear next to the username
  Auth.logIn(token, client, '/my-va', 3)
    .assert.title('My VA | Veterans Affairs')
    .waitForElementVisible(selectors.menu, Timeouts.slow);

  // click dropdown on username
  client.click(selectors.menu);

  // logout button is there
  client.expect.element(selectors.signOut).to.be.visible;

  // log out button reads "Sign Out"
  client.expect.element(selectors.signOut).text.to.equal('Sign Out');

  // click Sign Out & verify new location is correct logout URL
  client.click(selectors.signOut).verify.urlContains(Auth.logoutRequestUrl);

  client.end();
});
