import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const goToNextPage = () => {
  cy.findAllByText(/Continue/i, { selector: 'button' }).click();
};

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'data'),
    dataSets: ['test-data'],
    setupPerTest: () => {},
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/Get started/i, { selector: 'button' })
            .last()
            .click();
        });
      },
      goals: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const fieldName = 'checkboxGroupGoals_setACareerPath';
            const fieldData = data[fieldName];
            if (fieldData) {
              cy.get(`input[name="root_${fieldName}"]`)
                .shadow()
                .find('label')
                .click();
            }
            cy.injectAxeThenAxeCheck();
            goToNextPage();
          });
        });
      },
    },
    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
