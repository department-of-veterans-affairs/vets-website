const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts');
const PageHelpers = require('../e2e/vic-helpers');
const testData = require('./schema/maximal-test.json');

const runTest = E2eHelpers.createE2eTest(
  (client) => {
    PageHelpers.initPhotoUploadMock();
    PageHelpers.initDocumentUploadMock();
    PageHelpers.initApplicationSubmitMock();
    PageHelpers.initApplicationPollMock();

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
      client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(3)', 'progress-segment-complete');
      client.waitForElementVisible('label.usa-button.usa-button-secondary', Timeouts.normal);
      client.axeCheck('.main');

      // Disable upload button style to reveal input for test
      /* HACK: style overridden so browser driver can find/interact with hidden inputs
         (see https://github.com/nightwatchjs/nightwatch/issues/505) */
      client
        .execute("document.getElementsByName('fileUpload')[0].style.display = 'block';");
      // HACK: waitforElementVisible did not work but this does 
      client.elementIdDisplayed('errorable-file-input-11');

      // sighted path
      // upload photo
      client
        .setValue('input[name="fileUpload"]', require('path').resolve(`${__dirname}/examplephoto.png`));

      // crop photo
      client.waitForElementVisible('.cropper-container-outer', Timeouts.normal);
      client.click('.form-panel .usa-button-primary');

      // preview photo
      client.waitForElementVisible('.photo-preview', Timeouts.normal);
      client.axeCheck('.main');

      // nonsighted path
      // upload photo
      client.click('.photo-preview-link');
      client
        .execute("document.getElementsByName('screenReaderFileUpload')[0].style.display = 'block';");
      // HACK: waitforElementVisible did not work but this does 
      client.elementIdDisplayed('errorable-file-input-12');
      client
        .setValue('input[name="screenReaderFileUpload"]', require('path').resolve(`${__dirname}/examplephoto.png`));

      // preview photo
      client.waitForElementVisible('.photo-preview', Timeouts.normal);
      client.axeCheck('.main');
      client.click('.form-panel .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/photo');

      // Discharge Documents page
      client
        .waitForElementVisible('label[for="root_dd214"]', Timeouts.normal);
      client
        .assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(3)', 'progress-segment-complete');
      client.axeCheck('.main');

      // Disable upload button style to reveal input for test
      /* HACK: style overridden so browser driver can find/interact with hidden inputs
         (see https://github.com/nightwatchjs/nightwatch/issues/505) */
      client
        .execute("document.getElementById('root_dd214').style.display = 'block';")
        .waitForElementVisible('#root_dd214', Timeouts.normal);

      client
        .setValue('input#root_dd214', require('path').resolve(`${__dirname}/VA40-10007.pdf`));
      client
        .waitForElementVisible('label#root_dd214_add_label', Timeouts.slow);
      client.click('.form-panel .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/dd214');

      // Review and Submit Page.
      client
        .waitForElementVisible('label[name="privacyAgreement-label"]', Timeouts.slow);
      client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(4)', 'progress-segment-complete');
      client.axeCheck('.main');
      client.click('input[type="checkbox"]');
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/review-and-submit');
      client.expect.element('.js-test-location').attribute('data-location')
        .to.not.contain('/review-and-submit').before(Timeouts.slow);

      // Submit message
      client.waitForElementVisible('.schemaform-confirmation-section-header', Timeouts.normal);

      client.axeCheck('.main');
    }
    client.end();
  }
);

module.exports = runTest;
