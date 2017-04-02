const E2eHelpers = require('../../e2e/e2e-helpers');
const Timeouts = require('../../e2e/timeouts.js');
const EduHelpers = require('../../e2e/edu-helpers');
const Edu1990eHelpers = require('../../e2e/edu-1990e-helpers');
const testData = require('./schema/maximal-test.json');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    EduHelpers.initApplicationSubmitMock('1990e');
    // TODO: enable once 1990e is launched
    if (global.__BUILDTYPE__ !== 'production') {
      // Ensure introduction page renders.
      client
        .url(`${E2eHelpers.baseUrl}/education/apply-for-education-benefits/application/1990e`)
        .waitForElementVisible('body', Timeouts.normal)
        .assert.title('Apply for education benefits: Vets.gov')
        .waitForElementVisible('div.form-progress-buttons', Timeouts.slow)
        .click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.overrideVetsGovApi(client);
      E2eHelpers.overrideSmoothScrolling(client);
      E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

      // Applicant information page
      client
        .waitForElementVisible('input[name="root_relativeFullName_first"]', Timeouts.slow);
      EduHelpers.completeRelativeInformation(client, testData.applicantInformation.data, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/applicant/information');

      // Additional benefits page
      client
        .waitForElementVisible('label[for="root_nonVaAssistance"]', Timeouts.slow);
      EduHelpers.completeAdditionalBenefits(client, testData.benefitEligibility.data, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/applicant/additional-benefits');

      // Benefits eligibility page
      client
        .waitForElementVisible('label[for="root_benefit"]', Timeouts.slow);
      EduHelpers.completeBenefitsSelection(client, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/benefits/eligibility');

      // Sponsor information page
      client
        .waitForElementVisible('input[name="root_veteranFullName_first"]', Timeouts.slow);
      EduHelpers.completeVeteranInformation(client, testData.sponsorVeteran.data, false);
      EduHelpers.completeVeteranAddress(client, testData.sponsorVeteran.data);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/sponsor/information');

      // Education history page
      client
        .waitForElementVisible('input[name="root_postHighSchoolTrainings_0_name"]', Timeouts.slow);
      Edu1990eHelpers.completeEducationHistory(client, testData.educationHistory.data, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/education/history');

      // Employment history page
      client
        .waitForElementVisible('label[for="root_view:hasNonMilitaryJobs"]', Timeouts.slow);
      Edu1990eHelpers.completeEmploymentHistory(client, testData.employmentHistory.data, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/employment/history');

      // School selection page
      client
        .waitForElementVisible('input[name="root_educationProgram_name"]', Timeouts.slow);
      EduHelpers.completeSchoolSelection(client, testData.schoolSelection.data, true);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/school-selection');

      // Contact information page
      client
        .waitForElementVisible('label[for="root_preferredContactMethod"]', Timeouts.slow);
      EduHelpers.completeContactInformation(client, testData.contactInformation.data, false, true);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/contact-information');

      // Direct deposit page
      client
        .waitForElementVisible('label[for="root_bankAccount_accountType"]', Timeouts.slow);
      EduHelpers.completeDirectDeposit(client, testData.directDeposit.data, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/direct-deposit');

      // Review and submit page
      client
        .waitForElementVisible('label[name="privacyAgreement-label"]', Timeouts.slow);
      client
        .pause(1000)
        .click('input[type="checkbox"]')
        .click('.form-progress-buttons .usa-button-primary');
      client.expect.element('.js-test-location').attribute('data-location')
            .to.not.contain('/review-and-submit').before(Timeouts.submission);

      // Confirmation page
      client
        .expect.element('.edu-benefits-submit-success').to.be.visible;

      client.end();
    }
  }
);
