const E2eHelpers = require('../util/e2e-helpers');
const Timeouts = require('../util/timeouts.js');
const LoginHelpers = require('../util/login-helpers');

if (!process.env.BUILDTYPE || process.env.BUILDTYPE === 'development') {
  module.exports = E2eHelpers.createE2eTest(
    (client) => {
      const token = LoginHelpers.getUserToken();

      // log in and wait for little person icon to appear next to the username
      LoginHelpers.logIn(token, client, '/', 3)
        .assert.title('Vets.gov')
        .waitForElementVisible('#login-root > div > div.sign-in-link > div > button > span > svg', Timeouts.slow);

      // click dropdown on username
      client.click('#login-root > div > div.sign-in-link > div > button');

      // ensure Sign Out button is there
      client.expect.element('#accountMenu > ul > li:nth-child(2) > a').to.be.visible;

      // click Sign Out & verify new window has correct logout url
      client
        .click('#accountMenu > ul > li:nth-child(2) > a')
        .windowHandles(function foo(result) {
          this.verify.equal(result.value.length, 2, 'There should be 2 windows open');
          const newWindow = result.value[1];
          this.switchWindow(newWindow);
          this.verify.urlContains(LoginHelpers.getLogoutUrl());
        });

      client.end();
    }
  );
}
