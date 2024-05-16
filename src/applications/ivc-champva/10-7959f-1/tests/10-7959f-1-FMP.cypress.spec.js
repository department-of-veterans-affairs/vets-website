import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import { fillDateWebComponentPattern } from '../../shared/tests/helpers';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'e2e', 'fixtures', 'data'),
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
      'applicant-information': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testdata').then(data => {
            fillDateWebComponentPattern(
              'veteransFullName',
              data.veteranFullName,
            );
            fillDateWebComponentPattern(
              'veteranDateOfBirth',
              data.veteranDateOfBirth,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('POST', formConfig.submitUrl, { status: 200 });
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
