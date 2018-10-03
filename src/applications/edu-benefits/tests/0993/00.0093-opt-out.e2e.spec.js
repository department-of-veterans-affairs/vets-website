const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const manifest = require('../../0993/manifest.json');
const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');
const PageHelpers = require('./0993-helpers');
const testData = require('./schema/maximal-test.json');
const FormsTestHelpers = require('../../../../platform/testing/e2e/form-helpers');

module.exports = E2eHelpers.createE2eTest(client => {
  PageHelpers.initApplicationSubmitMock('0993');

  E2eHelpers.overrideVetsGovApi(client);
  FormsTestHelpers.overrideFormsScrolling(client);

  client
    .url(
      `${
        E2eHelpers.baseUrl
      }/education/opt-out-information-sharing/opt-out-form-0993/`,
    )
    .waitForElementVisible('body', Timeouts.normal);

  // Claimant information
  client
    .waitForElementVisible(
      'input[name="root_claimantFullName_first"]',
      Timeouts.normal,
    )
    .axeCheck('.main');
  PageHelpers.completeClaimantInformation(client, testData.data);
  client.click('.form-progress-buttons .usa-button-primary');

  // Review and submit page
  E2eHelpers.expectNavigateAwayFrom(client, '/claimant-information');
  client
    .waitForElementVisible(
      'label[name="privacyAgreementAccepted-label"]',
      Timeouts.slow,
    )
    .pause(1000)
    .click('input[type="checkbox"]')
    .axeCheck('.main')
    .click('.form-progress-buttons .usa-button-primary');
  client.expect
    .element('.js-test-location')
    .attribute('data-location')
    .to.not.contain('/review-and-submit')
    .before(Timeouts.submission);

  // Confirmation page
  client.waitForElementVisible(
    '.schemaform-confirmation-section-header',
    Timeouts.normal,
  );

  client.axeCheck('.main');
  client.end();
});

module.exports['@disabled'] = !manifest.production;
