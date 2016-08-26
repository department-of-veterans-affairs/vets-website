const E2eHelpers = require('../util/e2e-helpers');
const Timeouts = require('../util/timeouts.js');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    // Ensure introduction page renders.
    client
      .url(`${E2eHelpers.baseUrl}/rx/`)
			.waitForElementVisible('body', Timeouts.normal)
      .assert.title('Refill your prescriptions: Vets.gov')
      .waitForElementVisible('.va-tab-content', Timeouts.slow)
      .click('.va-tabs li:last');

    // Ensure API data loads and renders
    E2eHelpers.expectNavigateAwayFrom(client, '/introduction');
  }
);
