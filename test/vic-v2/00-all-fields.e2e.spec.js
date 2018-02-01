const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts');
const PageHelpers = require('../e2e/vic-helpers');
const testData = require('./schema/maximal-test.json');

const runTest = E2eHelpers.createE2eTest(
  (client) => {
    PageHelpers.initApplicationSubmitMock();
    PageHelpers.initDocumentUploadMock();

    if (process.env.BUILDTYPE !== 'production') {
    // Ensure introduction page renders.
      client
        .url(`${E2eHelpers.baseUrl}/veteran-id-card/apply`)
        .waitForElementVisible('body', Timeouts.normal)
        .assert.title('Apply for a Veteran ID Card: Vets.gov')
        .waitForElementVisible('.schemaform-title', Timeouts.slow)  // First render of React may be slow.
        .click('.schemaform-start-button');

      E2eHelpers.overrideVetsGovApi(client);
      E2eHelpers.overrideSmoothScrolling(client);
      E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

      // Applicant information page
      client.waitForElementVisible('input[name="root_veteranFullName_first"]', Timeouts.normal);
      client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(1)', 'progress-segment-complete');
      PageHelpers.completeApplicantInformation(client, testData.data);
      client.axeCheck('.main')
        .click('.form-panel .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/applicant-information');

      // Address page
      client.waitForElementVisible('input[name="root_veteranAddress_city"]', Timeouts.normal);
      client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(2)', 'progress-segment-complete');
      PageHelpers.completeAddressInformation(client, testData.data);
      client.axeCheck('.main')
        .click('.form-panel .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/address-information');

      // Contact info page
      client.waitForElementVisible('input[name="root_email"]', Timeouts.normal);
      PageHelpers.completeContactInformation(client, testData.data);
      client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(2)', 'progress-segment-complete');
      client.axeCheck('.main')
        .click('.form-panel .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/contact-information');

      // Review and Submit Page.
      // client
      //   .waitForElementVisible('label[name="privacyAgreement-label"]', Timeouts.slow)
      //   .pause(1000)
      //   .click('input[type="checkbox"]')
      //   .axeCheck('.main')
      //   .click('.form-progress-buttons .usa-button-primary');
      // E2eHelpers.expectNavigateAwayFrom(client, '/review-and-submit');
      // client.expect.element('.js-test-location').attribute('data-location')
      //   .to.not.contain('/review-and-submit').before(Timeouts.slow);
      //
      // // Submit message
      // client.waitForElementVisible('.confirmation-page-title', Timeouts.normal);
      //
      // client.axeCheck('.main');
    }
    client.end();
  }
);

module.exports = runTest;
