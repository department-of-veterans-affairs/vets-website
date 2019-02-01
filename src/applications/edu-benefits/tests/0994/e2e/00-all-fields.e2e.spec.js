const E2eHelpers = require('../../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../../platform/testing/e2e/timeouts');
const VetTecHelpers = require('./vet-tec-helpers');
const testData = require('../schema/maximal-test.json');
const FormsTestHelpers = require('../../../../../platform/testing/e2e/form-helpers');
const Auth = require('../../../../../platform/testing/e2e/auth');
const ENVIRONMENTS = require('../../../../../site/constants/environments');

const runTest = E2eHelpers.createE2eTest(client => {
  if (process.env.BUILDTYPE !== ENVIRONMENTS.VAGOVPROD) {
    const token = Auth.getUserToken();
    const formData = testData.data;

    Auth.logIn(
      token,
      client,
      '/education/apply-for-education-benefits/application/0994/',
      3,
    );

    // Ensure introduction page renders.
    client.assert
      .title('Apply for education benefits: VA.gov')
      .waitForElementVisible('.schemaform-start-button', Timeouts.slow)
      .axeCheck('.main')
      .click('.schemaform-start-button');

    E2eHelpers.overrideVetsGovApi(client);
    FormsTestHelpers.overrideFormsScrolling(client);
    E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

    // Benefits eligibility
    // Personal Information
    E2eHelpers.expectLocation(client, 'applicant/information');
    client.axeCheck('.main');
    client.click('.form-progress-buttons .usa-button-primary');

    // Already submitted
    VetTecHelpers.completeAlreadySubmitted(client, formData);

    // Military Service
    VetTecHelpers.completeMilitaryService(client, formData);

    // Education History
    VetTecHelpers.completeEducationHistory(client, formData);

    // High Tech work experience
    VetTecHelpers.completeHighTechWorkExp(client, formData);

    client.axeCheck('.main');
    client.end();
  }
});

module.exports = runTest;
