const E2eHelpers = require('../util/e2e-helpers');
const Timeouts = require('../util/timeouts.js');
const RxHelpers = require('../util/rx-helpers');
const LoginHelpers = require('../util/login-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();

    RxHelpers.initApplicationSubmitMock(token);

    // Ensure introduction page renders.
    LoginHelpers.logIn(token, client, '/healthcare/prescriptions', 3)
      .assert.title('Refill your prescriptions: Vets.gov')
      .waitForElementVisible('#rx-active', Timeouts.slow)
      .click('.va-tabs li:last-child a')
      .waitForElementVisible('#rx-history', Timeouts.normal)
      .waitForElementVisible('.rx-table', Timeouts.slow);
  }
);
