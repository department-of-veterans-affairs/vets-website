const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const manifest = require('../../0993/manifest.json');
const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');
const PageHelpers = require('./0993-helpers');
const testData = require('./schema/maximal-test.json');
const FormsTestHelpers = require('../../../../platform/testing/e2e/form-helpers');

module.exports = E2eHelpers.createE2eTest((client) => {
  if (process.env.BUILDTYPE !== 'production') {

    E2eHelpers.overrideVetsGovApi(client);
    FormsTestHelpers.overrideFormsScrolling(client);

    client
      .url(`${E2eHelpers.baseUrl}/education/opt-out-information-sharing/opt-out-form-0993/`)
      .waitForElementVisible('body', Timeouts.normal);

    // Claimant information
    client.waitForElementVisible('input[name="root_onBehalfOf"]', Timeouts.normal)
      .axeCheck('.main');
    PageHelpers.completeClaimantInformation(client, testData.data);

    // Submit
    client
      .click('input[name="privacyAgreement"]')
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/claimant-information');
    client.expect.element('.js-test-location').attribute('data-location')
      .to.not.contain('/claimant-information').before(Timeouts.slow);

    // Submit message
    client.waitForElementVisible('.schemaform-confirmation-section-header', Timeouts.normal);

    client.axeCheck('.main');
    client.end();

    client.end();
  }
});

module.exports['@disabled'] = !manifest.production;
