import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const testConfig = createTestConfig(
  {
    // Directory & dataset configuration -------------------------------------------------
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'data'),

    // Rename and modify the test data as needed.
    dataSets: ['test-data'],

    // --------------------------------------------------------------------------
    // Page specific hooks
    // --------------------------------------------------------------------------
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          // Click the start button rendered by the introduction/login components
          // This covers both <button> and <va-button> implementations.
          cy.get('a.vads-c-action-link--green')
            .first()
            .click();
        });
      },
    },

    // --------------------------------------------------------------------------
    // Global setup for every test case
    // --------------------------------------------------------------------------
    setupPerTest: () => {
      // 5490 requires an authenticated session
      cy.login();

      // Stub the backend submission endpoint so the test doesn't make a real request
      cy.intercept('POST', formConfig.submitUrl, { statusCode: 200 });
    },
    _13647Exception: true,
  },
  manifest,
  formConfig,
);

// Execute the form-tester using the config defined above
// ------------------------------------------------------

testForm(testConfig);
