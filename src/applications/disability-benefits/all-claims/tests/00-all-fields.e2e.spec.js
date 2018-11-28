const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../platform/testing/e2e/timeouts');
const PageHelpers = require('./disability-benefits-helpers');
const testData = require('./schema/maximal-test.new.json');
const FormsTestHelpers = require('../../../../platform/testing/e2e/form-helpers');
const Auth = require('../../../../platform/testing/e2e/auth');

const runTest = E2eHelpers.createE2eTest(client => {
  const token = Auth.getUserToken();

  PageHelpers.initInProgressMock(token);
  PageHelpers.initDocumentUploadMock();
  PageHelpers.initApplicationSubmitMock();
  PageHelpers.initItfMock(token);
  PageHelpers.initPaymentInformationMock(token);

  Auth.logIn(
    token,
    client,
    '/disability-benefits/apply/form-526-all-claims/',
    3,
  );

  // Ensure introduction page renders.
  client
    .url(`${E2eHelpers.baseUrl}/disability-benefits/apply/form-526-all-claims`)
    .waitForElementVisible('body', Timeouts.normal)
    // First render of React may be slow.
    .waitForElementVisible(
      '.schemaform-intro .usa-button-primary',
      Timeouts.slow,
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
  client.axeCheck('.main');
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information');

  // Alternate Name
  client.axeCheck('.main');
  PageHelpers.completeAlternateName(client, testData.data);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/alternate-names');

  // Military Retirement Pay
  client.axeCheck('.main');
  PageHelpers.completeMilitaryRetiredPay(client, testData.data);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/service-pay');

  // Military Service History
  client.axeCheck('.main');
  PageHelpers.completeMilitaryHistory(client, testData.data);
  client.click('.form-progress-buttons .usa-button-primary');

  // Reserves/National Guard Info
  client.axeCheck('.main');
  PageHelpers.completeReservesNationalGuardInfo(client, testData.data);
  client.click('.form-progress-buttons .usa-button-primary');

  // Federal Orders
  client.axeCheck('.main');
  PageHelpers.completeFederalOrders(client, testData.data);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/military-service-history');

  // Disabilities
  // Orientation
  client.axeCheck('.main').click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/disabilities/orientation');

  // Rated Disability Selection
  client.axeCheck('.main');
  PageHelpers.selectDisabilities(client); // Just selects the first one
  client.click('.form-progress-buttons .usa-button-primary');

  // New Disability
  client.axeCheck('.main');
  PageHelpers.completeNewDisability(client, testData.data);
  client.click('.form-panel .usa-button-primary');
  E2eHelpers.expectNavigateAwayFromExact(client, '/new-disabilities');

  // Unemployability Status
  client.axeCheck('.main');
  PageHelpers.completeUnemployabilityStatus(client, testData.data);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(
    client,
    '/new-disabilities/unemployability-status',
  );

  // POW Status
  client.axeCheck('.main');
  PageHelpers.completePowStatus(client, testData.data);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/pow');

  // Summary of Disabilities
  client.axeCheck('.main').click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/disabilities/summary');

  // Supporting Evidence
  // Orientation
  client.axeCheck('.main').click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/supporting-evidence/orientation');

  // Evidence Types
  client.axeCheck('.main');
  PageHelpers.completeEvidenceTypes(client, testData.data);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(
    client,
    '/supporting-evidence/evidence-types',
  );

  // Private Medical Records Choice
  client.axeCheck('.main');
  PageHelpers.completePrivateMedicalRecordsChoice(client, testData.data);
  client
    .click('.form-progress-buttons .usa-button-primary')
    .click('.form-progress-buttons .usa-button-primary'); // I have to click the button twice. Unsure why.
  E2eHelpers.expectNavigateAwayFromExact(
    client,
    '/supporting-evidence/private-medical-records',
  );

  // Private Medical Records Release
  E2eHelpers.expectLocation(
    client,
    '/supporting-evidence/private-medical-records-release',
  );
  client.axeCheck('.main');
  PageHelpers.completeRecordReleaseInformation(client, testData.data);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(
    client,
    '/supporting-evidence/private-medical-records-release',
  );

  // Evidence Summary
  E2eHelpers.expectLocation(client, '/supporting-evidence/summary');
  client.axeCheck('.main').click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/supporting-evidence/summary');

  // Possibly used outside of flow to, and including, 4142
  // Veteran Address Information
  // client.axeCheck('.main');
  // PageHelpers.completeVeteranAddressInformation(client, testData.data);
  // client.click('.form-progress-buttons .usa-button-primary');
  // E2eHelpers.expectNavigateAwayFrom(client, '/address-information');

  // Payment Information
  // client.axeCheck('.main');
  // client.click('.form-progress-buttons .usa-button-primary');
  // E2eHelpers.expectNavigateAwayFrom(client, '/payment-information');

  // Homelessness
  // client.axeCheck('.main');
  // PageHelpers.completeHomelessness(client, testData.data);
  // client.click('.form-progress-buttons .usa-button-primary');
  // E2eHelpers.expectNavigateAwayFrom(client, '/special-circumstances');

  // VA Medical Records Intro
  // client.axeCheck('.main').click('.form-panel .usa-button-primary');
  // E2eHelpers.expectNavigateAwayFrom(
  //   client,
  //   '/supporting-evidence/0/va-medical-records',
  // );

  // VA Facilities
  // client.axeCheck('.main');
  // PageHelpers.completeVAFacilitiesInformation(client, testData.data);
  // client.click('.form-panel .usa-button-primary');
  // E2eHelpers.expectNavigateAwayFrom(
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
  // E2eHelpers.expectNavigateAwayFrom(client, '/chapter-five/page-one');

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
  // E2eHelpers.expectNavigateAwayFrom(client, '/review-and-submit');
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
