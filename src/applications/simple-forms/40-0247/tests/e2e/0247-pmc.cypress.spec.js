import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataDir: path.join(__dirname, 'fixtures', 'data'),

    // Rename and modify the test data as needed.
    dataSets: ['test-data'],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/start/i, { selector: 'button' })
            .last()
            .click();
        });
      },
    },

    setupPerTest: () => {
      // Log in if the form requires an authenticated session.
      // cy.login();

      cy.intercept(formConfig.submitUrl, mockSubmit);
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
