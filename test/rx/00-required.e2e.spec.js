const E2eHelpers = require('../util/e2e-helpers');
const Timeouts = require('../util/timeouts.js');
const RxHelpers = require('../util/rx-helpers');
const LoginHelpers = require('../util/login-helpers');

if (!process.env.BUILDTYPE || process.env.BUILDTYPE === 'development') {
  module.exports = E2eHelpers.createE2eTest(
    (client) => {
      RxHelpers.initApplicationSubmitMock();
      LoginHelpers.logIn(client, '/healthcare/prescriptions', 3);

      // Ensure introduction page renders.
      client
        .url(`${E2eHelpers.baseUrl}/healthcare/prescriptions`)
        .waitForElementVisible('body', Timeouts.normal)
        .assert.title('Refill your prescriptions: Vets.gov')
        .waitForElementVisible('#rx-active', Timeouts.slow)
        .click('.va-tabs li:last-child a')
        .waitForElementVisible('#rx-history', Timeouts.normal)
        .waitForElementVisible('.rx-table', Timeouts.slow);
    }
  );
}
