const E2eHelpers = require('../../e2e/e2e-helpers');
// const Timeouts = require('../../e2e/timeouts.js');
const EduHelpers = require('../../e2e/edu-helpers');
// const testData = require('./schema/maximal-test.json');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    EduHelpers.initApplicationSubmitMock('1990e');

    // TODO: enable once 1990e is launched
    /*
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
    EduHelpers.completeAdditionalBenefits(client, testData.benefitEligibility.data);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/applicant/additional-benefits');

    // Benefits eligibility page
    client
      .waitForElementVisible('label[for="root_benefit"]', Timeouts.slow);
    EduHelpers.completeBenefitsSelection(client);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/benefits/eligibility');

    // Sponsor information page
    client
      .waitForElementVisible('input[name="root_veteranFullName_first"]', Timeouts.slow);
    EduHelpers.completeVeteranInformation(client, testData.sponsorVeteran.data, false);
    EduHelpers.completeVeteranAddress(client, testData.sponsorVeteran.data);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/sponsor/information');

    */
    client.end();
  }
);
