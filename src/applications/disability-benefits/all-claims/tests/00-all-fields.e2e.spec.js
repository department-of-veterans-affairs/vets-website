const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../platform/testing/e2e/timeouts');
const PageHelpers = require('./disability-benefits-helpers');
const testData = require('./data/maximal-test.json');
const FormsTestHelpers = require('../../../../platform/testing/e2e/form-helpers');
const Auth = require('../../../../platform/testing/e2e/auth');

const runTest = E2eHelpers.createE2eTest(client => {
  const token = Auth.getUserToken();

  Auth.logIn(
    token,
    client,
    '/disability/file-disability-claim-form-21-526ez/',
    3,
  );

  PageHelpers.initInProgressMock(token);
  PageHelpers.initDocumentUploadMock();
  PageHelpers.initApplicationSubmitMock();
  PageHelpers.initItfMock(token);
  PageHelpers.initPaymentInformationMock(token);

  // Ensure introduction page renders.
  client.assert
    .title('Apply for disability benefits: VA.gov')
    // First render of React may be slow.
    .waitForElementVisible('.schemaform-title', Timeouts.slow) // First render of React may be slow.
    .waitForElementVisible(
      '.schemaform-intro .usa-button-primary',
      Timeouts.verySlow,
    )
    .click('.schemaform-intro .usa-button-primary')
    // Click past the `You already have an Intent to File` screen.
    .waitForElementVisible('.usa-grid .usa-button-primary', Timeouts.slow)
    .click('.usa-grid .usa-button-primary');

  E2eHelpers.overrideVetsGovApi(client);
  FormsTestHelpers.overrideFormsScrolling(client);
  E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

  // Veteran Details
  // Review Veteran Information
  E2eHelpers.expectLocation(client, '/veteran-information');
  client.axeCheck('.main');
  client.click('.form-progress-buttons .usa-button-primary');

  // Alternate Name
  E2eHelpers.expectLocation(client, '/alternate-names');
  client.axeCheck('.main');
  PageHelpers.completeAlternateName(client, testData.data);
  client.click('.form-progress-buttons .usa-button-primary');

  // Military Retirement Pay
  E2eHelpers.expectLocation(client, '/service-pay');
  client.axeCheck('.main');
  PageHelpers.completeMilitaryRetiredPay(client, testData.data);
  client.click('.form-progress-buttons .usa-button-primary');

  // Military Service History
  E2eHelpers.expectLocation(client, 'military-service-history');
  client.axeCheck('.main');
  PageHelpers.completeMilitaryHistory(client, testData.data);
  client.click('.form-progress-buttons .usa-button-primary');

  // Combat Zone Post 9/11
  E2eHelpers.expectLocation(client, '/combat-status');
  client.axeCheck('.main');
  PageHelpers.completeCombatZonePost911(client, testData.data);
  client.click('.form-progress-buttons .usa-button-primary');

  // Reserves/National Guard Info
  E2eHelpers.expectLocation(client, 'reserves-national-guard');
  client.axeCheck('.main');
  PageHelpers.completeReservesNationalGuardInfo(client, testData.data);
  client.click('.form-progress-buttons .usa-button-primary');

  // Federal Orders
  E2eHelpers.expectLocation(client, '/federal-orders');
  client.axeCheck('.main');
  PageHelpers.completeFederalOrders(client, testData.data);
  client.click('.form-progress-buttons .usa-button-primary');

  // Disabilities
  // Orientation
  E2eHelpers.expectLocation(client, '/disabilities/orientation');
  client.axeCheck('.main').click('.form-progress-buttons .usa-button-primary');

  // Rated Disability Selection
  E2eHelpers.expectLocation(client, '/disabilities/rated-disabilities');
  client.axeCheck('.main');
  PageHelpers.selectDisabilities(client); // Just selects the first one
  client.click('.form-progress-buttons .usa-button-primary');
  // ****
  // // New Disability
  // E2eHelpers.expectLocation(client, '/new-disabilities');
  // client.axeCheck('.main');
  // PageHelpers.completeNewDisability(client, testData.data);
  // client.click('.form-progress-buttons .usa-button-primary');

  // // PTSD
  // E2eHelpers.expectLocation(
  //   client,
  //   '/disabilities/ptsd-incident-description-0',
  // );

  // // Unemployability Status
  // E2eHelpers.expectLocation(client, '/new-disabilities/unemployability-status');
  // client.axeCheck('.main');
  // PageHelpers.completeUnemployabilityStatus(client, testData.data);
  // client.click('.form-progress-buttons .usa-button-primary');

  // // POW Status
  // E2eHelpers.expectLocation(client, '/pow');
  // client.axeCheck('.main');
  // PageHelpers.completePowStatus(client, testData.data);
  // client.click('.form-progress-buttons .usa-button-primary');

  // // Additional disability benefits
  // E2eHelpers.expectLocation(client, 'additional-disability-benefits');
  // client.axeCheck('.main');
  // client.click('.form-progress-buttons .usa-button-primary');

  // start 4142
  // // Summary of Disabilities
  // E2eHelpers.expectLocation(client, '/disabilities/summary');
  // client.axeCheck('.main').click('.form-progress-buttons .usa-button-primary');

  // // Supporting Evidence
  // // Orientation
  // E2eHelpers.expectLocation(client, '/supporting-evidence/orientation');
  // client.axeCheck('.main').click('.form-progress-buttons .usa-button-primary');

  // // Evidence Types
  // E2eHelpers.expectLocation(client, '/supporting-evidence/evidence-types');
  // client.axeCheck('.main');
  // PageHelpers.completeEvidenceTypes(client, testData.data);
  // client.click('.form-progress-buttons .usa-button-primary');

  // // Private Medical Records Choice
  // E2eHelpers.expectLocation(
  //   client,
  //   '/supporting-evidence/private-medical-records',
  // );
  // client.axeCheck('.main');
  // PageHelpers.completePrivateMedicalRecordsChoice(client, testData.data);
  // client
  //   .click('.form-progress-buttons .usa-button-primary')
  //   .click('.form-progress-buttons .usa-button-primary'); // I have to click the button twice. Unsure why.

  // // Private Medical Records Release
  // E2eHelpers.expectLocation(
  //   client,
  //   '/supporting-evidence/private-medical-records-release',
  // );
  // client.axeCheck('.main');
  // PageHelpers.completeRecordReleaseInformation(client, testData.data);
  // client.click('.form-progress-buttons .usa-button-primary');
  // E2eHelpers.expectLocation(
  //   client,
  //   '/supporting-evidence/private-medical-records-release',
  // );
  // end 4142

  // // Evidence Summary
  // E2eHelpers.expectLocation(client, '/supporting-evidence/summary');
  // client.axeCheck('.main').click('.form-progress-buttons .usa-button-primary');
  // E2eHelpers.expectLocation(client, '/supporting-evidence/summary');

  // Possibly used outside of flow to, and including, 4142
  // Veteran Address Information
  // client.axeCheck('.main');
  // PageHelpers.completeVeteranAddressInformation(client, testData.data);
  // client.click('.form-progress-buttons .usa-button-primary');
  // E2eHelpers.expectLocation(client, '/address-information');

  // Payment Information
  // client.axeCheck('.main');
  // client.click('.form-progress-buttons .usa-button-primary');
  // E2eHelpers.expectLocation(client, '/payment-information');

  // Homelessness
  // client.axeCheck('.main');
  // PageHelpers.completeHomelessness(client, testData.data);
  // client.click('.form-progress-buttons .usa-button-primary');
  // E2eHelpers.expectLocation(client, '/special-circumstances');

  // VA Medical Records Intro
  // client.axeCheck('.main').click('.form-panel .usa-button-primary');
  // E2eHelpers.expectLocation(
  //   client,
  //   '/supporting-evidence/0/va-medical-records',
  // );

  // VA Facilities
  // client.axeCheck('.main');
  // PageHelpers.completeVAFacilitiesInformation(client, testData.data);
  // client.click('.form-panel .usa-button-primary');
  // E2eHelpers.expectLocation(
  //   client,
  //   '/supporting-evidence/0/va-facilities',
  // );

  // Record upload
  // E2eHelpers.expectLocation(client, '/supporting-evidence/0/documents');
  // client.axeCheck('.main');
  // client.click('.form-panel .usa-button-primary');
  // E2eHelpers.expectLocation(
  //   client,
  //   '/supporting-evidence/0/additionalDocuments',
  // );

  // Additional document upload
  // E2eHelpers.expectLocation(
  //   client,
  //   '/supporting-evidence/0/additionalDocuments',
  // );
  // client.axeCheck('.main');
  // client.click('.form-panel .usa-button-primary');
  // E2eHelpers.expectLocation(client, '/supporting-evidence/0/evidence-summary');

  // Second Disability Evidence Type
  // E2eHelpers.expectLocation(client, '/supporting-evidence/1/evidence-type');
  // client.axeCheck('.main');
  // client.click('.form-panel .usa-button-primary');
  // E2eHelpers.expectLocation(client, '/supporting-evidence/1/evidence-summary');

  // Second Evidence Summary
  // E2eHelpers.expectLocation(client, '/supporting-evidence/1/evidence-summary');
  // client.axeCheck('.main');
  // client.click('.form-panel .usa-button-primary');
  // E2eHelpers.expectLocation(client, '/chapter-five/page-one');

  // chapter 5 page 1
  // E2eHelpers.expectLocation(client, '/chapter-five/page-one');
  // client.axeCheck('.main');
  // client.click('.form-panel .usa-button-primary');
  // E2eHelpers.expectLocation(client, '/chapter-five/page-one');

  // Review and Submit Page.
  // client.waitForElementVisible(
  //   'label[name="privacyAgreementAccepted-label"]',
  //   Timeouts.slow,
  // );
  // client.assert.cssClassPresent(
  //   '.progress-bar-segmented div.progress-segment:nth-child(4)',
  //   'progress-segment-complete',
  // );
  // client.axeCheck('.main');

  // Accept privacy agreement
  // client.click('input[type="checkbox"]');
  // client.click('.form-progress-buttons .usa-button-primary');
  // E2eHelpers.expectLocation(client, '/review-and-submit');
  // client.expect
  //   .element('.js-test-location')
  //   .attribute('data-location')
  //   .to.not.contain('/review-and-submit')
  //   .before(Timeouts.slow);

  // Submit message
  // client.waitForElementVisible(
  //   '.schemaform-confirmation-section-header',
  //   Timeouts.normal,
  // );

  client.axeCheck('.main');
  client.end();
});

module.exports = runTest;
module.exports['@disabled'] = true;
