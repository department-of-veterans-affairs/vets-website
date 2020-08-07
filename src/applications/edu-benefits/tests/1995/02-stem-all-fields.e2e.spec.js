const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts.js');
const EduHelpers = require('../1990/edu-helpers');
const Edu1995Helpers = require('./edu-1995-helpers');
const testData = require('./schema/e2e-maximal-test.json');
const FormsTestHelpers = require('platform/testing/e2e/form-helpers');

module.exports = E2eHelpers.createE2eTest(client => {
  EduHelpers.initApplicationSubmitMock('1995s');

  // Ensure introduction page renders.
  client
    .openUrl(
      `${
        E2eHelpers.baseUrl
      }/education/apply-for-education-benefits/application/1995`,
    )
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible('.schemaform-start-button', Timeouts.slow)
    .axeCheck('.main')
    .click('.schemaform-start-button');
  E2eHelpers.overrideVetsGovApi(client);
  FormsTestHelpers.overrideFormsScrolling(client);
  E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

  // Veteran information page.
  E2eHelpers.expectLocation(client, '/applicant/information');
  client.waitForElementVisible(
    'input[name="root_veteranFullName_first"]',
    Timeouts.slow,
  );
  EduHelpers.completeApplicantInformation(client, testData.data, 'veteran');
  client.axeCheck('.main').click('.form-progress-buttons .usa-button-primary');

  // Benefits eligibility page.
  E2eHelpers.expectLocation(client, '/benefits/eligibility');
  client.waitForElementVisible('label[for="root_benefit_0"]', Timeouts.slow);
  EduHelpers.completeBenefitsSelection(client, testData.data);
  client.axeCheck('.main').click('.form-progress-buttons .usa-button-primary');

  // STEM page
  E2eHelpers.expectLocation(client, '/benefits/stem');
  Edu1995Helpers.completeStemSelectionFor1995s(client);
  Edu1995Helpers.completeStemEnrollmentSelection(client);
  Edu1995Helpers.completeExhaustionOfBenefits(client);
  client.axeCheck('.main').click('.form-progress-buttons .usa-button-primary');

  // STEM eligibility
  E2eHelpers.expectLocation(client, '/benefits/stem-eligibility');
  Edu1995Helpers.completeStillApplyForStem(client);
  client.axeCheck('.main').click('.form-progress-buttons .usa-button-primary');

  // Active duty page
  E2eHelpers.expectLocation(client, '/active-duty');
  client.waitForElementVisible(
    'label[for="root_isActiveDutyYes"]',
    Timeouts.slow,
  );
  Edu1995Helpers.completeActiveDutySelection(client);
  client.axeCheck('.main').click('.form-progress-buttons .usa-button-primary');

  // New school page.
  E2eHelpers.expectLocation(client, '/school-selection/new-school');
  client.waitForElementVisible(
    'label[for="root_educationType"]',
    Timeouts.slow,
  );
  Edu1995Helpers.completeNewSchool(client, testData.data);
  client.axeCheck('.main').click('.form-progress-buttons .usa-button-primary');

  // Old school
  E2eHelpers.expectLocation(client, '/school-selection/old-school');
  client.waitForElementVisible(
    'label[for="root_oldSchool_name"]',
    Timeouts.slow,
  );
  Edu1995Helpers.completeOldSchool(client, testData.data);
  client.axeCheck('.main').click('.form-progress-buttons .usa-button-primary');

  // Contact information page.
  E2eHelpers.expectLocation(
    client,
    '/personal-information/contact-information',
  );
  client.waitForElementVisible(
    'label[for="root_preferredContactMethod_0"]',
    Timeouts.slow,
  );
  EduHelpers.completeContactInformation(client, testData.data);
  client.axeCheck('.main').click('.form-progress-buttons .usa-button-primary');

  // Direct deposit page.
  E2eHelpers.expectLocation(client, '/personal-information/direct-deposit');
  client.waitForElementVisible(
    'label[for="root_bankAccountChange_0"]',
    Timeouts.slow,
  );
  EduHelpers.completePaymentChange(client, testData.data);
  EduHelpers.completeDirectDeposit(client, testData.data);
  client.axeCheck('.main').click('.form-progress-buttons .usa-button-primary');

  // Review and submit page.
  client
    .waitForElementVisible(
      'label[name="privacyAgreementAccepted-label"]',
      Timeouts.slow,
    )
    .pause(1000)
    .click('input[type="checkbox"]')
    .axeCheck('.main')
    .click('.form-progress-buttons .usa-button-primary')
    .expect.element('.js-test-location')
    .attribute('data-location')
    .to.not.contain('/review-and-submit')
    .before(Timeouts.slow);

  // Confirmation page.
  client.waitForElementVisible('.confirmation-page-title', Timeouts.normal);
  client.axeCheck('.main').end();
});
