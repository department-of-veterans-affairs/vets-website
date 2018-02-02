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

      // Photo page
      client.waitForElementVisible('[id="root_photo-label"]', Timeouts.normal);
      client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(3)', 'progress-segment-complete');
      client.axeCheck('.main');
      // if (!process.env.SAUCE_ACCESS_KEY) {
      // Looks like there are issues with uploads in nightwatch and Selenium
      // https://github.com/nightwatchjs/nightwatch/issues/890
      // client
      // .setValue('input#root_application_preneedAttachments', require('path').resolve(`${__dirname}/VA40-10007.pdf`));
      // client.selectDropdown('root_application_preneedAttachments_0_atachmentId', 1)
      // }
      client.click('.form-panel .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/photo');

      // Discharge Documents page
      client.waitForElementVisible('label[for="root_dd214"]', Timeouts.normal);
      client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(3)', 'progress-segment-complete');
      client.axeCheck('.main');

      // Disable upload button style to reveal input for test
      client
      /* HACK: style overridden so browser driver can find/interact with hidden inputs
         (see https://github.com/nightwatchjs/nightwatch/issues/505) */
        .execute("document.getElementById('root_dd214').style.display = 'block';")
        .waitForElementVisible('#root_dd214', Timeouts.normal);

      client
        .setValue('input#root_dd214', require('path').resolve(`${__dirname}/VA40-10007.pdf`));
      client.click('.form-panel .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/dd214');

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
