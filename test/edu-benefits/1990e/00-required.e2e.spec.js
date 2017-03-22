const E2eHelpers = require('../../util/e2e-helpers');
const Timeouts = require('../../util/timeouts.js');
const EduHelpers = require('../../util/edu-helpers');
const Edu1990eHelpers = require('../../util/edu-1990e-helpers');
const testData = require('./schema/maximal-test.json');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    Edu1990eHelpers.initApplicationSubmitMock();
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
    EduHelpers.completeRelativeInformation(client, testData.applicantInformation.data, true);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/applicant/information');

    // Additional benefits page (no required fields)
    client
      .waitForElementVisible('label[for="root_civilianBenefitsAssistance"]', Timeouts.slow);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/applicant/additional-benefits');

    // Benefits eligibility (no required fields)
    client
      .waitForElementVisible('label[for="root_benefit"]', Timeouts.slow);
    client.click('.form-progress-buttons .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/benefits/eligibility');
  }
);
