const E2eHelpers = require('../../util/e2e-helpers');
const Timeouts = require('../../util/timeouts.js');
const EduHelpers = require('../../util/edu-helpers');

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
    E2eHelpers.overrideSmoothScrolling(client);
    E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

    // Veteran information page.
    client
      .expect.element('input[name="fname"]').to.be.visible;
    EduHelpers.completeVeteranInformation(client, EduHelpers.testValues, true);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information');

    // Benefits eligibility
    client
      .waitForElementVisible('label[name="chapter30-label"]', Timeouts.slow);
    EduHelpers.completeBenefitsSelection(client, EduHelpers.testValues, true);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/benefits-elibility/benefits-selection');

    // Service periods page.
    client
      .expect.element('input[name="serviceBranch"]').to.be.visible;
    EduHelpers.completeServicePeriods(client, EduHelpers.testValues, true);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-history/service-periods');

    // Military service page.
    client
      .expect.element('input[name="serviceAcademyGraduationYear"]').to.be.visible;
    // Another mysteriously required pause. If we don't wait here, then the click below will
    // do nothing sometimes.
    client.pause(1000);
    EduHelpers.completeMilitaryService(client, EduHelpers.testValues, true);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-history/military-service');

    // ROTC History
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-history/rotc-history');

    // Contributions
    client.waitForElementVisible('label[name="civilianBenefitsAssistance-label"]', Timeouts.slow);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-history/contributions');

    // Education history
    client.click('input[name="highSchoolOrGedCompletionDateYear"]');
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/education-history/education-information');

    // Employment history
    client
      .waitForElementPresent('input[name="hasNonMilitaryJobs-0"]', Timeouts.slow)
      // And more hacky pauses... the button click will not work without this.
      .pause(1000);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/employment-history/employment-information');

    // School selection
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/school-selection/school-information');

    // Contact information page.
    client
      .expect.element('select[name="country"]').to.be.visible;
    EduHelpers.completeContactInformation(client, EduHelpers.testValues, true);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/contact-information');

    // Secondary contact page
    client
      .waitForElementPresent('input[name="secondaryContactName"]', Timeouts.slow)
      // And more hacky pauses... the button click will not work without this.
      .pause(1000);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/personal-information/secondary-contact');

    // Direct deposit page
    client.click('.form-progress-buttons .usa-button-primary');
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
      .click('.form-progress-buttons .usa-button-primary');
    client.expect.element('.js-test-location').attribute('data-location')
      .to.not.contain('/review-and-submit').before(Timeouts.submission);

    // Submit message
    client
      .expect.element('.edu-benefits-submit-success').to.be.visible;

    client.end();
  }
);
