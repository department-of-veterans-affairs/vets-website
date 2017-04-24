const E2eHelpers = require('../../e2e/e2e-helpers');
const Timeouts = require('../../e2e/timeouts.js');
const EduHelpers = require('../../e2e/edu-helpers');
const Edu5495Helpers = require('../../e2e/edu-5495-helpers');
const testData = require('./schema/maximal-test.json');

if (process.env.BUILDTYPE !== 'production') {
  module.exports = E2eHelpers.createE2eTest(
    (client) => {
      EduHelpers.initApplicationSubmitMock('5495');

      // Ensure introduction page renders.
      client
        .url(`${E2eHelpers.baseUrl}/education/apply-for-education-benefits/application/5495`)
        .waitForElementVisible('body', Timeouts.normal)
        .assert.title('Apply for education benefits: Vets.gov')
        .waitForElementVisible('div.form-progress-buttons', Timeouts.slow)
        .axeCheck('.main')
        .click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.overrideVetsGovApi(client);
      E2eHelpers.overrideSmoothScrolling(client);
      E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

      // Applicant information page.
      client
        .waitForElementVisible('input[name="root_relativeFullName_first"]', Timeouts.slow);
      EduHelpers.completeRelativeInformation(client, testData.applicantInformation.data, false);
      client
        .axeCheck('.main')
        .click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/applicant/information');

      // Applicant service page
      client
        .waitForElementVisible('label[for="root_view:applicantServedYes"]', Timeouts.slow);
      EduHelpers.completeServicePeriods(client, testData.applicantService.data, false, 'view:applicantServed');
      client
        .axeCheck('.main')
        .click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/applicant/service');

      // Benefits eligibility page.
      client
        .waitForElementVisible('label[for="root_benefit"]', Timeouts.slow);
      EduHelpers.completeBenefitsSelection(client, testData.benefitSelection.data, false);
      client
        .axeCheck('.main')
        .click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/benefits/eligibility');

      // Sponsor information page
      client
        .waitForElementVisible('input[name="root_veteranFullName_first"]', Timeouts.slow);
      Edu5495Helpers.completeSponsorInformation(client, testData.sponsorInformation.data);
      client
        .axeCheck('.main')
        .click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/sponsor/information');


      // New school page.
      client
        .waitForElementVisible('label[for="root_educationProgram_name"]', Timeouts.slow);
      EduHelpers.completeSchoolSelection(client, testData.newSchool.data, false);
      client
        .axeCheck('.main')
        .click('.form-progress-buttons .usa-button-primary');

      // Old school
      client
        .waitForElementVisible('label[for="root_oldSchool_name"]', Timeouts.slow);
      Edu5495Helpers.completeOldSchool(client, testData.oldSchool.data, false);
      client
        .axeCheck('.main')
        .click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/school-selection/old-school');

      // Contact information page.
      client
        .waitForElementVisible('label[for="root_preferredContactMethod"]', Timeouts.slow);
      EduHelpers.completeContactInformation(client, testData.contactInformation.data, false, true);
      client
        .axeCheck('.main')
        .click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/contact-information');

      // Direct deposit page.
      client
        .waitForElementVisible('label[for="root_bankAccountChange"]', Timeouts.slow);
      EduHelpers.completePaymentChange(client, testData.directDeposit.data, false);
      EduHelpers.completeDirectDeposit(client, testData.directDeposit.data, false);
      client
        .axeCheck('.main')
        .click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/direct-deposit');

      // Review and submit page.
      client
        .waitForElementVisible('label[name="privacyAgreement-label"]', Timeouts.slow)
        .pause(1000)
        .click('input[type="checkbox"]')
        .axeCheck('.main')
        .click('.form-progress-buttons .usa-button-primary')
        .expect.element('.js-test-location').attribute('data-location')
          .to.not.contain('/review-and-submit').before(Timeouts.slow);

      // Confirmation page.
      client
        .expect.element('.edu-benefits-submit-success').to.be.visible;
      client
        .axeCheck('.main')
        .end();
    }
  );
}
