import fs from 'fs';
import path from 'path';

const E2eHelpers = require('../../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../../platform/testing/e2e/timeouts');
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
  returnToBeginning,
} from './vet-tec-helpers';

const dirName = path.join(__dirname, '../schema/');
const startUrl =
  '/education/about-gi-bill-benefits/how-to-use-benefits/vettec-high-tech-program/apply-for-vettec-form-22-0994/';

const authentication = client => {
  const token = Auth.getUserToken();

  Auth.logIn(token, client, startUrl, 3);

  // Ensure introduction page renders.
  client.assert
    .title('Apply for education benefits: VA.gov')
    .waitForElementVisible('.schemaform-start-button', Timeouts.verySlow)
    .axeCheck('.main')
    .click('.schemaform-start-button');

  E2eHelpers.overrideVetsGovApi(client);
  FormsTestHelpers.overrideFormsScrolling(client);
  E2eHelpers.expectNavigateAwayFrom(client, '/introduction');
};

const e2eTests = (client, formData) => {
  // Benefits eligibility
  // Personal Information
  completeFormPage('/applicant/information', client);

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

  // Return to beginning of flow
  returnToBeginning(client, startUrl);
};

const runTest = E2eHelpers.createE2eTest(client => {
  if (process.env.BUILDTYPE !== ENVIRONMENTS.VAGOVPROD) {
    authentication(client);

    const files = fs.readdirSync(dirName);
    files.filter(file => file.endsWith('json')).forEach(file => {
      const contents = JSON.parse(
        fs.readFileSync(path.join(dirName, file), 'utf8'),
      );
      e2eTests(client, contents.data);
    });

    client.axeCheck('.main');
    client.end();
  }
});

module.exports = runTest;
