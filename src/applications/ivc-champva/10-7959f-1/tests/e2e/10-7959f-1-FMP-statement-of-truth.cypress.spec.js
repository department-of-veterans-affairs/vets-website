import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import {
  fillAddressWebComponentPattern,
  verifyAllDataWasSubmitted,
  getAllPages,
} from '../../../shared/tests/helpers';

import mockFeatureToggles from './fixtures/mocks/featureToggles.json';

const ALL_PAGES = getAllPages(formConfig);

function getSotInput() {
  return cy
    .get('va-statement-of-truth')
    .shadow()
    .get('va-text-input')
    .shadow()
    .get('#inputField');
}

function typeInStatementOfTruthAndSubmit(text) {
  getSotInput().clear();
  getSotInput().type(`${text}`, { force: true });
}

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    // Rename and modify the test data as needed.
    dataSets: ['test-data'],
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
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            // Type wrong value in the signature to trigger an error
            typeInStatementOfTruthAndSubmit(
              `${data.statementOfTruthSignature}FALSE`,
            );

            // Check the checkbox, which invokes onblur on signature input and shows
            // the error message we want to verify:
            cy.get(`va-statement-of-truth`)
              .shadow()
              .find('va-checkbox')
              .shadow()
              .get('#checkbox-element')
              .click({ force: true });

            // Expect an error
            cy.get('va-statement-of-truth')
              .shadow()
              .get('va-text-input')
              .shadow()
              .findByText(
                /Please enter your name exactly as it appears on your application/i,
              )
              .should('exist');

            // Type the proper name in to clear the errror
            typeInStatementOfTruthAndSubmit(data.statementOfTruthSignature);

            cy.findByText('Submit', {
              selector: 'button',
            }).click();
          });
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles);
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
    // skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
