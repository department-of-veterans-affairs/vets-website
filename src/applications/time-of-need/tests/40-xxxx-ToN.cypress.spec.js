import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import mockUser from './fixtures/mocks/user.json';
import formConfig from '../config/form';
import manifest from '../manifest.json';

// Prototype form (VA Form 40-xxxx placeholder)
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
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
