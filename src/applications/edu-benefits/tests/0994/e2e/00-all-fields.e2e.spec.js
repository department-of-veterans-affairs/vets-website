const E2eHelpers = require('../../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../../platform/testing/e2e/timeouts');
const testData = require('../schema/maximal-test.json');
const FormsTestHelpers = require('../../../../../platform/testing/e2e/form-helpers');
const Auth = require('../../../../../platform/testing/e2e/auth');
const ENVIRONMENTS = require('../../../../../site/constants/environments');

import {
  completeFormPage,
  completeAlreadySubmitted,
  completeMilitaryService,
  completeEducationHistory,
  completeHighTechWorkExp,
  getTrainingProgramsChoice,
  completeTrainingProgramChoice,
  completeTrainingProgramsInformation,
  completeContactInformation,
  completeBankInformation,
  completeReviewAndSubmit,
} from './vet-tec-helpers';

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
      .waitForElementVisible('.schemaform-start-button', Timeouts.verySlow)
      .axeCheck('.main')
      .click('.schemaform-start-button');

    E2eHelpers.overrideVetsGovApi(client);
    FormsTestHelpers.overrideFormsScrolling(client);
    E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

    // Benefits eligibility
    // Personal Information
    completeFormPage('/applicant/information', client, formData);

    // Already submitted
    completeFormPage(
      '/benefits-eligibility',
      client,
      formData,
      completeAlreadySubmitted,
    );

    // Military Service
    completeFormPage(
      '/military-service',
      client,
      formData,
      completeMilitaryService,
    );

    // Education History
    completeFormPage(
      '/education-history',
      client,
      formData,
      completeEducationHistory,
    );

    // High Tech work experience
    completeFormPage(
      '/work-experience',
      client,
      formData,
      completeHighTechWorkExp,
    );

    // Training program choice
    completeFormPage(
      '/training-programs-choice',
      client,
      formData,
      completeTrainingProgramChoice,
    );

    // Training Programs information
    if (getTrainingProgramsChoice(formData)) {
      completeFormPage(
        '/training-programs-information',
        client,
        formData,
        completeTrainingProgramsInformation,
      );
    }

    // Contact Information
    completeFormPage(
      '/contact-information',
      client,
      formData,
      completeContactInformation,
    );

    // Bank Information
    completeFormPage(
      '/bank-information',
      client,
      formData,
      completeBankInformation,
    );

    // Review and Submit
    completeReviewAndSubmit(client, formData);

    client.axeCheck('.main');
    client.end();
  }
});

module.exports = runTest;
