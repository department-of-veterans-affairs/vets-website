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

    // Veteran information page.
    EduHelpers.completeVeteranInformation(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');

    // Benefits selection page.
    EduHelpers.completeBenefitsSelection(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');

    // Benefits relinquishment page.
    EduHelpers.completeBenefitsRelinquishment(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');

    // Service periods page.
    EduHelpers.completeServicePeriods(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');

    // Military service page.
    EduHelpers.completeMilitaryService(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');

    // ROTC history page.
    EduHelpers.completeRotcHistory(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');

    // Contributions page.
    EduHelpers.completeContributions(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');

    // Education history page.
    EduHelpers.completeEducationHistory(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');

    // Employment history page.
    EduHelpers.completeEmploymentHistory(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');

    // School selection Page.
    EduHelpers.completeSchoolSelection(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');

    // Contact information page.
    EduHelpers.completeContactInformation(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');

    // Secondary contact page.
    EduHelpers.completeSecondaryContact(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');

    // Direct Deposit Page.
    EduHelpers.completeDirectDeposit(client, EduHelpers.testValues, true);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');

    // Review and Submit Page.
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');

    // Submit message
    client
      .axeCheck('.main');

    client.end();
  });
