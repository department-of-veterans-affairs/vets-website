import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['new-agreement-test', 'modify-existing-test', 'withdrawal-test'],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('.schemaform-start-button')
            .first()
            .click();
        });
      },
      'yellow-ribbon-program-request/0': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(({ agreementType }) => {
            if (agreementType === 'modifyExistingAgreement') {
              cy.fillVaTextInput('root_academicYear', '2025-2026');
            }
            cy.tabToSubmitForm();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#inputField', { timeout: 10000 }).type('John Doe', {
            force: true,
          });
          cy.get('#checkbox-element').check({ force: true });
          cy.findByText(/Continue/i, { selector: 'button' }).click();
        });
      },
    },

    setupPerTest: () => {},

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
