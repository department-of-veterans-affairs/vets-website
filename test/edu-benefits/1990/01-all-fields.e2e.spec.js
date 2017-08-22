const E2eHelpers = require('../../e2e/e2e-helpers');
const Timeouts = require('../../e2e/timeouts.js');
const EduHelpers = require('../../e2e/edu-1990-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    EduHelpers.initApplicationSubmitMock();

    // Ensure introduction page renders.
    client
      .url(`${E2eHelpers.baseUrl}/education/apply-for-education-benefits/application/`)
      .waitForElementVisible('body', Timeouts.normal)
      .assert.title('Apply for education benefits: Vets.gov')
      .waitForElementVisible('.usa-button-primary', Timeouts.slow)
      .axeCheck('.main')
      .click('.usa-button-primary');
    E2eHelpers.overrideVetsGovApi(client);
    E2eHelpers.overrideSmoothScrolling(client);
    E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

    // Veteran information page.
    client
      .expect.element('input[name="fname"]').to.be.visible;
    EduHelpers.completeVeteranInformation(client, EduHelpers.testValues);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information');

    // Benefits eligibility
    client
      .expect.element('label[name="chapter30-label"]').to.be.visible;
    EduHelpers.completeBenefitsSelection(client);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/benefits-eligibility/benefits-selection');

    // Benefits relinquishment
    client
      .expect.element('input[name="benefitsRelinquished-1"]').to.be.present;
    EduHelpers.completeBenefitsRelinquishment(client, EduHelpers.testValues);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/benefits-eligibility/benefits-relinquishment');

    // Service periods page.
    client
      .expect.element('input[name="serviceBranch"]').to.be.visible;
    EduHelpers.completeServicePeriods(client, EduHelpers.testValues);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-history/service-periods');

    // Military service page.
    client
      .expect.element('input[name="serviceAcademyGraduationYear"]').to.be.visible;
    EduHelpers.completeMilitaryService(client, EduHelpers.testValues);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-history/military-service');

    // ROTC History
    client
      .expect.element('input[name="seniorRotcCommissioned-0"]').to.be.present;
    EduHelpers.completeRotcHistory(client, EduHelpers.testValues);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-history/rotc-history');

    // Benefits history
    client
      .expect.element('input[name="civilianBenefitsAssistance"]').to.be.present;
    EduHelpers.completeContributions(client, EduHelpers.testValues);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-history/contributions');

    // Education history
    client
      .expect.element('select[name="highSchoolOrGedCompletionDateMonth"]').to.be.visible;
    EduHelpers.completeEducationHistory(client, EduHelpers.testValues);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/education-history/education-information');

    // Employment history
    client
      .expect.element('input[name="hasNonMilitaryJobs-0"]').to.be.present;
    EduHelpers.completeEmploymentHistory(client, EduHelpers.testValues);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/employment-history/employment-information');

    // School selection
    client
      .expect.element('select[name="educationType"]').to.be.visible;
    EduHelpers.completeSchoolSelection(client, EduHelpers.testValues);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/school-selection/school-information');

    // Contact information page.
    client
      .expect.element('select[name="country"]').to.be.visible;
    EduHelpers.completeContactInformation(client, EduHelpers.testValues);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/contact-information');

    // Secondary contact page
    client
      .expect.element('input[name="secondaryContactName"]').to.be.visible;
    EduHelpers.completeSecondaryContact(client, EduHelpers.testValues);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/secondary-contact');

    // Direct deposit page
    client
      .expect.element('input[name="accountNumber"]').to.be.visible;
    EduHelpers.completeDirectDeposit(client, EduHelpers.testValues);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/direct-deposit');

    // Review and Submit Page.
    client.execute((selector) => {
      document.querySelector(selector).click();
    }, ['label[name="privacyAgreement-label"]']);
    client
      .axeCheck('.main')
      .click('.usa-button-primary')
      .expect.element('.js-test-location').attribute('data-location')
        .to.not.contain('/review-and-submit').before(Timeouts.slow);

    // Submit message
    client.waitForElementVisible('.confirmation-page-title', Timeouts.normal);
    client
      .axeCheck('.main')
      .end();
  }
);
