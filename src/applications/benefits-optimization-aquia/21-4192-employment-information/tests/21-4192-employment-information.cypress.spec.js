import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '@bio-aquia/21-4192-employment-information/config/form';
import manifest from '@bio-aquia/21-4192-employment-information/manifest.json';
import mockUser from './fixtures/mocks/user.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['minimal-test'],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/^start/i, { selector: 'a[href="#start"]' })
            .last()
            .click({ force: true });
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('GET', '/v0/user', mockUser);
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
