import path from 'path';
import environment from 'platform/utilities/environment';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import {
  fillAddressWebComponentPattern,
  reviewAndSubmitPageFlow,
  verifyAllDataWasSubmitted,
  getAllPages,
} from '../../shared/tests/helpers';

import mockFeatureToggles from './e2e/fixtures/mocks/featureToggles.json';

// For intercepting file uploads:
const UPLOAD_URL = `${environment.API_URL}/ivc_champva/v1/forms/submit_supporting_documents`;

const ALL_PAGES = getAllPages(formConfig);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'e2e', 'fixtures', 'data'),
    // Rename and modify the test data as needed.
    dataSets: ['test-data.json'],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/start/i, { selector: 'a' })
            .first()
            .click();
        });
      },
      [ALL_PAGES.page3.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressWebComponentPattern(
              'veteranAddress',
              data.veteranAddress,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.page4a.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressWebComponentPattern(
              'physicalAddress',
              data.physicalAddress,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.page7.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('input[type="file"]')
            .upload(
              path.join(__dirname, 'e2e/fixtures/data/example_upload.png'),
              'testing',
            )
            .get('.schemaform-file-uploading')
            .should('not.exist');
          cy.axeCheck();
          cy.findByText(/continue/i, { selector: 'button' }).click();
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            reviewAndSubmitPageFlow(data.statementOfTruthSignature, `Submit`);
          });
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles);
      cy.intercept('POST', `${UPLOAD_URL}*`, {
        statusCode: 200,
        body: {
          data: {
            attributes: {
              confirmationCode: '1b39d28c-5d38-4467-808b-9da252b6e95a',
              isEncrypted: 'false',
              name: 'file.png',
              size: '123',
            },
          },
        },
      });
      cy.intercept('POST', formConfig.submitUrl, req => {
        cy.get('@testData').then(dataPreTransform => {
          // Runs the test-data through transformForSubmit and compares it
          // to the submitted form data to make sure that all outputs are present:
          verifyAllDataWasSubmitted(
            JSON.parse(
              formConfig.transformForSubmit(formConfig, {
                data: dataPreTransform,
              }),
            ),
            req.body,
          );
        });
        // Mock response
        req.reply({ status: 200 });
      });
      cy.config('includeShadowDom', true);
    },
    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
