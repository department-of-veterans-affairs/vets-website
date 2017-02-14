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
      .waitForElementVisible('div.form-progress-buttons', Timeouts.slow)  // First render of React may be slow.
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

    E2eHelpers.overrideSmoothScrolling(client);

    // Veteran information page.
    client.pause(1000);
    EduHelpers.completeVeteranInformation(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information');

    // Benefits selection page.
    client.pause(1000);
    EduHelpers.completeBenefitsSelection(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/benefits-eligibility/benefits-selection');

    // Benefits relinquishment page.
    client.pause(1000);
    EduHelpers.completeBenefitsRelinquishment(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/benefits-eligibility/benefits-relinquishment');

    // Service periods page.
    client.pause(1000);
    EduHelpers.completeServicePeriods(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-history/service-periods');

    // Military service page.
    client.pause(1000);
    EduHelpers.completeMilitaryService(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-history/military-service');

    // ROTC history page.
    client.pause(1000);
    EduHelpers.completeRotcHistory(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-history/rotc-history');

    // Contributions page.
    client.pause(1000);
    EduHelpers.completeContributions(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-history/contributions');

    // Education history page.
    client.pause(1000);
    EduHelpers.completeEducationHistory(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/education-history/education-information');

    // Employment history page.
    client.pause(1000);
    EduHelpers.completeEmploymentHistory(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/employment-history/employment-information');

    // School selection Page.
    client.pause(1000);
    EduHelpers.completeSchoolSelection(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/school-selection/school-information');

    // Contact information page.
    client.pause(1000);
    EduHelpers.completeContactInformation(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/contact-information');

    // Secondary contact page.
    client.pause(1000);
    EduHelpers.completeSecondaryContact(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/secondary-contact');

    // Direct Deposit Page.
    client.pause(1000);
    EduHelpers.completeDirectDeposit(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/direct-deposit');

    // Review and Submit Page.
    client.pause(1000);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');

    // Submit message
    client
      .axeCheck('.main');

    client.end();
  });
