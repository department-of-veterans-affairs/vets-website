if (process.env.BUILDTYPE !== 'production') {
  const E2eHelpers = require('../../util/e2e-helpers');
  const Timeouts = require('../../util/timeouts.js');
  const EduHelpers = require('../../util/edu-1995-helpers');

  module.exports = E2eHelpers.createE2eTest(
    (client) => {
      EduHelpers.initApplicationSubmitMock();

      // Ensure introduction page renders.
      client
        .url(`${E2eHelpers.baseUrl}/education/apply-for-education-benefits/application/1995`)
        .waitForElementVisible('body', Timeouts.normal)
        .assert.title('Apply for education benefits: Vets.gov')
        .waitForElementVisible('div.form-progress-buttons', Timeouts.slow)
        .click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.overrideVetsGovApi(client);
      E2eHelpers.overrideSmoothScrolling(client);
      E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

      // Veteran information page.
      client
        .waitForElementVisible('input[name="root_veteranFullName_first"]', Timeouts.slow);
      EduHelpers.completeVeteranInformation(client, EduHelpers.testData.veteranInformation.data, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information');

      // Benefits eligibility
      client
        .waitForElementVisible('label[for="root_benefit"]', Timeouts.slow);
      EduHelpers.completeBenefitsSelection(client, EduHelpers.testData.benefitSelection.data);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/benefits-elibility/benefits-selection');

      // Service periods page.
      client
        .waitForElementVisible('label[for="root_view:newService"]', Timeouts.slow);
      EduHelpers.completeServicePeriods(client, EduHelpers.testData.servicePeriods.data, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/military-history/service-periods');

      // Military service page.
      client
        .waitForElementVisible('label[for="root_view:hasServiceBefore1978"]', Timeouts.slow);
      EduHelpers.completeMilitaryService(client, EduHelpers.testData.militaryHistory.data, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/military-history/military-service');

      // New school
      client
        .waitForElementVisible('label[for="root_educationType"]', Timeouts.slow);
      EduHelpers.completeNewSchool(client, EduHelpers.testData.newSchool.data, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/school-selection/new-school');

      // Old school
      client
        .waitForElementVisible('label[for="root_oldSchool_name"]', Timeouts.slow);
      EduHelpers.completeOldSchool(client, EduHelpers.testData.oldSchool.data, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/school-selection/old-school');

      // Contact information page.
      client
        .waitForElementVisible('label[for="root_preferredContactMethod"]', Timeouts.slow);
      EduHelpers.completeContactInformation(client, EduHelpers.testData.contactInformation.data, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/contact-information');

      // Dependents
      client
        .waitForElementVisible('label[for="root_serviceBefore1977_married"]', Timeouts.slow);
      EduHelpers.completeDependents(client, EduHelpers.testData.dependents.data, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/dependents');

      // Direct deposit page
      client
        .waitForElementVisible('label[for="root_bankAccountChange"]', Timeouts.slow);
      EduHelpers.completeDirectDeposit(client, EduHelpers.testData.directDeposit.data, false);
      client.click('.form-progress-buttons .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/direct-deposit');

      // Review and Submit Page.
      client
        .waitForElementVisible('label[name="privacyAgreement-label"]', Timeouts.slow);
      client
        .pause(1000)
        .click('input[type="checkbox"]')
        .click('.form-progress-buttons .usa-button-primary');
      client.expect.element('.js-test-location').attribute('data-location')
        .to.not.contain('/review-and-submit').before(Timeouts.submission);

      // Submit message
      client
        .expect.element('.edu-benefits-submit-success').to.be.visible;

      client.end();
    }
  );
}
