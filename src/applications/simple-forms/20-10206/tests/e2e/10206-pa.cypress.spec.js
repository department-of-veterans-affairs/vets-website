import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import {
  fillDateWebComponentPattern,
  fillTextAreaWebComponent,
  fillTextWebComponent,
  reviewAndSubmitPageFlow,
  selectCheckboxGroupWebComponent,
} from '../../../shared/tests/e2e/helpers';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/user.json';
import mockSipGet from './fixtures/mocks/sipGet.json';
import mockSipPut from './fixtures/mocks/sipPut.json';
import mockFeatureToggles from './fixtures/mocks/featureToggles.json';

// disable prefill for all tests
formConfig.prefillEnabled = false;
formConfig.prefillTransformer = () => {};

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataDir: path.join(__dirname, 'fixtures', 'data'),

    dataSets: ['test-data'],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findByText(/Start your request/g, { selector: 'a' }).click();
        });
      },
      'record-selections': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { recordSelections } = data;
            selectCheckboxGroupWebComponent(recordSelections);
            cy.findByText(/Continue/i, { selector: 'button' }).click();
          });
        });
      },
      'disability-exam-details': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { disabilityExams } = data;
            fillDateWebComponentPattern(
              'disabilityExams_0_disabilityExamDate',
              disabilityExams[0].disabilityExamDate,
            );
            cy.findByText(/Continue/i, { selector: 'button' }).click();
          });
        });
      },
      'other-compensation-and-pension-details': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { otherCompAndPenDetails } = data;
            fillTextWebComponent(
              'otherCompAndPenDetails',
              otherCompAndPenDetails,
            );
            cy.findByText(/Continue/i, { selector: 'button' }).click();
          });
        });
      },
      'other-benefit-details': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { otherBenefitDetails } = data;
            fillTextAreaWebComponent(
              'otherBenefitDetails',
              otherBenefitDetails,
            );
            cy.findByText(/Continue/i, { selector: 'button' }).click();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { fullName } = data;

            reviewAndSubmitPageFlow(fullName, 'Submit request');
          });
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);
      cy.intercept('GET', '/v0/user', mockUser);
      cy.intercept('GET', '/v0/in_progress_forms/20-10206', mockSipGet);
      cy.intercept('PUT', '/v0/in_progress_forms/20-10206', mockSipPut);
      cy.intercept('POST', formConfig.submitUrl, { status: 200 });

      cy.login(mockUser);
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
