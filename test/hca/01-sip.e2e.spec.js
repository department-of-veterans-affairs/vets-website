const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts.js');
const HcaHelpers = require('../e2e/hca-helpers.js');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    HcaHelpers.initSaveInProgressMock(client);

    // Ensure introduction page renders.
    client
      .url(`${E2eHelpers.baseUrl}/healthcare/apply/application`)
      .waitForElementVisible('body', Timeouts.normal)
      .assert.title('Apply for Health Care: Vets.gov')
      .waitForElementVisible('.schemaform-title', Timeouts.slow)  // First render of React may be slow.
      .pause(3000)
      .click('.usa-button-primary');

    E2eHelpers.overrideVetsGovApi(client);
    E2eHelpers.overrideSmoothScrolling(client);
    E2eHelpers.expectNavigateAwayFrom(client, '/introduction');
    client.assert.urlContains('/veteran-information/birth-information');

    client
      .click('.form-panel a')
      .waitForElementVisible('.usa-alert', Timeouts.normal);

    client.axeCheck('.main');

    client.end();
  });
