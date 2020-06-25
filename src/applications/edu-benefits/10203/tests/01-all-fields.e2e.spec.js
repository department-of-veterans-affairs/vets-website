const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts.js');
const EduHelpers = require('../../tests/1990/edu-helpers');
const Edu10203Helpers = require('./edu-10203-helpers');
const testData = require('./schema/e2e-maximal-test.json');
const FormsTestHelpers = require('platform/testing/e2e/form-helpers');

module.exports = E2eHelpers.createE2eTest(client => {
  EduHelpers.initApplicationSubmitMock('10203');

  // Ensure introduction page renders.
  client
    .openUrl(
      `${
        E2eHelpers.baseUrl
      }/education/apply-for-education-benefits/application/10203`,
    )
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible('.schemaform-start-button', Timeouts.slow)
    .axeCheck('.main');
  E2eHelpers.expectLocation(client, '/introduction');
  client.click('.schemaform-start-button');
  E2eHelpers.overrideVetsGovApi(client);
  FormsTestHelpers.overrideFormsScrolling(client);

  // Veteran information page.
  E2eHelpers.expectLocation(client, '/applicant/information');
  EduHelpers.completeApplicantInformation(client, testData.data, 'veteran');
  client.axeCheck('.main').click('.form-progress-buttons .usa-button-primary');

  // Benefits eligibility page.
  E2eHelpers.expectLocation(client, '/benefits/eligibility');
  EduHelpers.completeBenefitsSelection(client, testData.data);
  client.axeCheck('.main').click('.form-progress-buttons .usa-button-primary');

  // STEM page
  E2eHelpers.expectLocation(client, '/benefits/stem');
  Edu10203Helpers.completeStemSelection(client);
  client.axeCheck('.main').click('.form-progress-buttons .usa-button-primary');

  // Service periods page.
  E2eHelpers.expectLocation(client, '/active-duty');
  Edu10203Helpers.completeActiveDuty(client);
  client.axeCheck('.main').click('.form-progress-buttons .usa-button-primary');

  // Contact information page.
  E2eHelpers.expectLocation(
    client,
    '/personal-information/contact-information',
  );
  Edu10203Helpers.completeContactInformation(client, testData.data);
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
    .waitForElementVisible('div[class="usa-alert-body"]', Timeouts.slow);

  // Confirmation page.
  // E2eHelpers.expectLocation(client, '/confirmation');
  // client.waitForElementVisible('.confirmation-page-title', Timeouts.normal);
  // client.axeCheck('.main');

  client.end();
});

module.exports['@disabled'] = true;
