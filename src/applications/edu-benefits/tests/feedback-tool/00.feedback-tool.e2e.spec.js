const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const manifest = require('../../feedback-tool/manifest');
const Timeouts = require('../../../../platform/testing/e2e/timeouts');
const PageHelpers = require('./feedback-tool-helpers');
const testData = require('./schema/maximal-test.json');
const FormsTestHelpers = require('../../../../platform/testing/e2e/form-helpers');

module.exports = E2eHelpers.createE2eTest(client => {
  PageHelpers.initApplicationSubmitMock();

  client
    .url(`${E2eHelpers.baseUrl}/education/gi-bill-school-feedback`)
    .waitForElementVisible('body', Timeouts.normal)
    .assert.title('GI Bill® School Feedback Tool: Vets.gov')
    .waitForElementVisible('.schemaform-title', Timeouts.slow)
    .click('.schemaform-start-button');

  E2eHelpers.overrideVetsGovApi(client);
  FormsTestHelpers.overrideFormsScrolling(client);
  E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

  // Applicant relationship
  client
    .waitForElementPresent(
      'input[name="root_onBehalfOf"][value="Myself"]',
      Timeouts.normal,
    )
    .axeCheck('.main');
  PageHelpers.completeRelationshipInformation(client, testData.data);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/applicant-relationship');

  // Applicant information
  client
    .waitForElementVisible('input[name="root_fullName_first"]', Timeouts.normal)
    .axeCheck('.main');
  PageHelpers.completeApplicantInformation(client, testData.data);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/applicant-information');

  // Service information
  client
    .waitForElementVisible('select[name="root_serviceBranch"]', Timeouts.normal)
    .axeCheck('.main');
  PageHelpers.completeServiceInformation(client, testData.data);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/service-information');

  // Contact information
  client
    .waitForElementVisible(
      'select[name="root_address_country"]',
      Timeouts.normal,
    )
    .axeCheck('.main');
  PageHelpers.completeContactInformation(client, testData.data);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/contact-information');

  // Benefit information
  client
    .waitForElementPresent(
      'input[name="root_educationDetails_programs_TATU"]',
      Timeouts.normal,
    )
    .axeCheck('.main');
  PageHelpers.completeBenefitInformation(client, testData.data);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/benefits-information');

  // School information
  client
    .waitForElementPresent('input[type="checkbox"]', Timeouts.normal)
    .axeCheck('.main');
  PageHelpers.completeSchoolInformation(client, testData.data);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/school-information');

  // Issue information
  client
    .waitForElementPresent(
      'input[name="root_issue_recruiting"]',
      Timeouts.normal,
    )
    .axeCheck('.main');
  PageHelpers.completeIssueInformation(client, testData.data);
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectNavigateAwayFrom(client, '/issue-information');

  // Review and submit page
  client
    .waitForElementVisible(
      'label[name="privacyAgreementAccepted-label"]',
      Timeouts.slow,
    )
    .pause(1000)
    .click('input[type="checkbox"]')
    .axeCheck('.main')
    .click('.form-progress-buttons .usa-button-primary');
  client.pause(5000);
  client.expect
    .element('.js-test-location')
    .attribute('data-location')
    .to.not.contain('/review-and-submit')
    .before(Timeouts.submission);

  // Confirmation page
  client.waitForElementVisible('.confirmation-page-title', Timeouts.normal);

  client.axeCheck('.main');
  client.end();
});

module.exports['@disabled'] = manifest.e2eTestsDisabled;
