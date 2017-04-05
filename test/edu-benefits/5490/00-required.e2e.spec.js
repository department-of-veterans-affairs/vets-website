const E2eHelpers = require('../../e2e/e2e-helpers');
const Timeouts = require('../../e2e/timeouts.js');
const EduHelpers = require('../../e2e/edu-helpers');
const Edu5490Helpers = require('../../e2e/edu-5490-helpers');
const testData = require('./schema/maximal-test.json');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    EduHelpers.initApplicationSubmitMock('1995');

    // Ensure introduction page renders
    client
      .url(`${E2eHelpers.baseUrl}/education/apply-for-education-benefits/application/1995`)
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
    EduHelpers.completeRelativeInformation(client, testData.applicantInformation.data, true);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/applicant/information');

    // Additional benefits page
    client
      .waitForElementVisible('label[for="root_civilianBenefitsAssistance"]', Timeouts.slow);
    EduHelpers.completeAdditionalBenefits(client, testData.benefitEligibility.data, true);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/applicant/additional-benefits');

    // Applicant service page
    client
      .waitForElementVisible('label[for="root_view:newService"]', Timeouts.slow);
    EduHelpers.completeServicePeriods(client, testData.servicePeriods.data, true);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military/service');

    // Benefit selection page
    client
      .waitForElementVisible('label[for="root_benefit"]', Timeouts.slow);
    EduHelpers.completeBenefitsSelection(client);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/benefits/eligibility');

    // Benefit relinquishment page

    // Benefit history page

    // Sponsor information page
    // May need to write a 5490-specific function or modify completeVeteranInformation()
    // The selectors and data locations are different, but it's otherwise the same
    client
      .waitForElementVisible('input[name="root_view:currentSponsorInformation_veteranFullName_first"]', Timeouts.slow);
    EduHelpers.completeVeteranInformation(client, testData.veteranInformation.data, true);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran/information');

    // Sponsor service page

    // Education history page
    client
      .waitForElementVisible('input[name="root_postHighSchoolTrainings_0_name"]', Timeouts.slow);
    Edu5490Helpers.completeEducationHistory(client, testData.educationHistory.data, true);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/education/history');

    // Employment history page
    client
      .waitForElementVisible('label[for="root_view:hasNonMilitaryJobs"]', Timeouts.slow);
    Edu5490Helpers.completeEmploymentHistory(client, testData.employmentHistory.data, true);
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
    EduHelpers.completeContactInformation(client, testData.contactInformation.data, true);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/contact-information');

    // Secondary contact page

    // Direct deposit page
    client
      .waitForElementVisible('label[for="root_bankAccountChange"]', Timeouts.slow);
    EduHelpers.completePaymentChange(client, testData.directDeposit.data, true);
    EduHelpers.completeDirectDeposit(client, testData.directDeposit.data, true);
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
);
