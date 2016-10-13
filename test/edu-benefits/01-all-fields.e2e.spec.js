if (process.env.BUILDTYPE !== 'production') {
  const E2eHelpers = require('../util/e2e-helpers');
  const Timeouts = require('../util/timeouts.js');
  const EduHelpers = require('../util/edu-helpers');

  module.exports = E2eHelpers.createE2eTest(
    (client) => {
      EduHelpers.initApplicationSubmitMock();

      // Ensure introduction page renders.
      client
        .url(`${E2eHelpers.baseUrl}/education/apply-for-education-benefits/application/`)
        .waitForElementVisible('body', Timeouts.normal)
        .assert.title('Apply for education benefits: Vets.gov')
        .waitForElementVisible('div.form-progress-buttons', Timeouts.slow)
        .click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.overrideVetsGovApi(client);
      E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

      // Veteran information page.
      client
        .expect.element('input[name="fname"]').to.be.visible;
      EduHelpers.completeVeteranInformation(client, EduHelpers.testValues, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information');

      // Benefits eligibility
      client
        .expect.element('input[name="chapter30"]').to.be.visible;
      EduHelpers.completeBenefitsSelection(client, EduHelpers.testValues, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/benefits-elibility/benefits-selection');

      // Benefits waiver
      client
        .expect.element('input[name="benefitsRelinquished-1"]').to.be.visible;
      EduHelpers.completeBenefitsWaiver(client, EduHelpers.testValues, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/benefits-elibility/benefits-waiver');

      // Military service page.
      client
        .expect.element('input[name="serviceAcademyGraduationYear"]').to.be.visible;
      EduHelpers.completeMilitaryService(client, EduHelpers.testValues, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/military-history/military-service');

      // ROTC History
      client
        .expect.element('input[name="seniorRotcCommissioned-0"]').to.be.visible;
      EduHelpers.completeRotcHistory(client, EduHelpers.testValues, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/military-history/rotc-history');

      // Benefits history
      client
        .expect.element('input[name="civilianBenefitsAssistance"]').to.be.visible;
      EduHelpers.completeBenefitsHistory(client, EduHelpers.testValues, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/military-history/benefits-history');

      // Education history
      client
        .expect.element('select[name="highSchoolOrGedCompletionDateMonth"]').to.be.visible;
      EduHelpers.completeEducationHistory(client, EduHelpers.testValues, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/education-history/education-information');

      // Employment history
      client
        .expect.element('input[name="hasNonMilitaryJobs-0"]').to.be.visible;
      EduHelpers.completeEmploymentHistory(client, EduHelpers.testValues, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/employment-history/employment-information');

      // School selection
      client
        .expect.element('select[name="educationType"]').to.be.visible;
      EduHelpers.completeSchoolSelection(client, EduHelpers.testValues, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/school-selection/school-information');

      // Contact information page.
      client
        .expect.element('select[name="country"]').to.be.visible;
      EduHelpers.completeContactInformation(client, EduHelpers.testValues, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/contact-information');

      // Secondary contact page
      client
        .expect.element('input[name="secondaryContactName"]').to.be.visible;
      EduHelpers.completeSecondaryContact(client, EduHelpers.testValues, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/secondary-contact');

      // Direct deposit page
      client
        .expect.element('input[name="accountNumber"]').to.be.visible;
      EduHelpers.completeDirectDeposit(client, EduHelpers.testValues, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/direct-deposit');

      // Review and Submit Page.
      client.expect.element('button.edit-btn').to.be.visible;
      client
        .click('.form-progress-buttons .usa-button-primary');
      client.expect.element('.js-test-location').attribute('data-location')
        .to.not.contain('/review-and-submit').before(Timeouts.submission);

      // Submit message
      client
        .expect.element('.usa-alert-success').to.be.visible;

      client.end();
    }
  );
}
