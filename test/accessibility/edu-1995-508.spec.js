const E2eHelpers = require('../util/e2e-helpers');
const Timeouts = require('../util/timeouts.js');
const EduHelpers = require('../util/edu-helpers');
const Edu1995Helpers = require('../util/edu-1995-helpers');
const testData = require('../edu-benefits/1995/schema/maximal-test.json');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    EduHelpers.initApplicationSubmitMock();

    // Ensure introduction page renders.
    client
      .url(`${E2eHelpers.baseUrl}/education/apply-for-education-benefits/application/1995`)
      .waitForElementVisible('body', Timeouts.normal)
      .assert.title('Apply for education benefits: Vets.gov')
      .waitForElementVisible('div.form-progress-buttons', Timeouts.slow)
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.overrideVetsGovApi(client);
    E2eHelpers.overrideSmoothScrolling(client);
    E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

    // Veteran information page.
    client
      .waitForElementVisible('input[name="root_veteranFullName_first"]', Timeouts.slow);
    EduHelpers.completeVeteranInformation(client, testData.veteranInformation.data, false);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information');

    // Benefits eligibility
    client
      .waitForElementVisible('label[for="root_benefit"]', Timeouts.slow);
    EduHelpers.completeBenefitsSelection(client, testData.benefitSelection.data);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/benefits-elibility/benefits-selection');

    // Service periods page.
    client
      .waitForElementVisible('label[for="root_view:newService"]', Timeouts.slow);
    EduHelpers.completeServicePeriods(client, testData.servicePeriods.data, false);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-history/service-periods');

    // Military service page.
    client
      .waitForElementVisible('label[for="root_view:hasServiceBefore1978"]', Timeouts.slow);
    // Another mysteriously required pause. If we don't wait here, then the click below will
    // do nothing sometimes.
    client.pause(1000);
    Edu1995Helpers.completeMilitaryService(client, testData.militaryHistory.data, false);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-history/military-service');

    // New school
    client
      .waitForElementVisible('label[for="root_educationType"]', Timeouts.slow);
    Edu1995Helpers.completeNewSchool(client, testData.newSchool.data, false);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/school-selection/new-school');

    // Old school
    client
      .waitForElementVisible('label[for="root_oldSchool_name"]', Timeouts.slow);
    Edu1995Helpers.completeOldSchool(client, testData.oldSchool.data, false);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/school-selection/old-school');

    // Contact information page.
    client
      .waitForElementVisible('label[for="root_preferredContactMethod"]', Timeouts.slow);
    EduHelpers.completeContactInformation(client, testData.contactInformation.data, false);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/contact-information');

    // Dependents
    client
      .waitForElementVisible('label[for="root_serviceBefore1977_married"]', Timeouts.slow);
    Edu1995Helpers.completeDependents(client, testData.dependents.data, false);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/dependents');

    // Direct deposit page

    // No longer works with the updated direct deposit page
    client
      .waitForElementVisible('label[for="root_bankAccountChange"]', Timeouts.slow);
    EduHelpers.completeDirectDeposit(client, testData.directDeposit.data, false);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/direct-deposit');

    // Review and Submit Page.
    client
      .expect.element('label[name="privacyAgreement-label"]').to.be.visible;
    // When you try to click on the label in the normal way, it'll instead click on the link
    // inside the label that shows the popup. So we have to do this disgusting hack.
    client.pause(1000);
    client.execute((selector) => {
      document.querySelector(selector).click();
    }, ['label[name="privacyAgreement-label"]']);
    client.pause(1000);
    client
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');
    client.expect.element('.js-test-location').attribute('data-location')
      .to.not.contain('/review-and-submit').before(Timeouts.submission);

    // Submit message
    client
      .expect.element('.edu-benefits-submit-success').to.be.visible;

    client.end();
  }
);
