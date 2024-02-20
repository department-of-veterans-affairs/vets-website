import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import manifest from '../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataDir: path.join(__dirname, 'data'),

    // Rename and modify the test data as needed.
    dataSets: ['test-data'],

    pageHooks: {
      confirmation: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/View and save your completed request/i, {
            selector: 'a',
          })
            .last()
            .click();
        });
      },
    },

    setupPerTest: () => {
      // cy.route('POST', 'download-url', { status: 200 });
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  {},
);

testForm(testConfig);
