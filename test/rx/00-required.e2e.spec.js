// TODO(james): address this with a feature flag

if (process.env.BUILDTYPE === 'development') {
  const E2eHelpers = require('../util/e2e-helpers');
  const Timeouts = require('../util/timeouts.js');
  const RxHelpers = require('../util/rx-helpers');

  module.exports = E2eHelpers.createE2eTest(
    (client) => {
      RxHelpers.initApplicationSubmitMock();

      // Ensure introduction page renders.
      client
        .url(`${E2eHelpers.baseUrl}/healthcare/prescriptions`)
                          .waitForElementVisible('body', Timeouts.normal);

        // TODO(crew): add tests for login component
        // .assert.title('Refill your prescriptions: Vets.gov')
        // .waitForElementVisible('.va-tab-content', Timeouts.slow)
        // .click('.va-tabs li:last-child a')
        // .waitForElementVisible('.rx-table', Timeouts.normal);
    }
  );
}
