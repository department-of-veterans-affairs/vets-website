import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import mockSubmit from './fixtures/mocks/application-submit.json';

import formConfig from '../config/form';
import manifest from '../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataDir: path.join(__dirname, 'fixtures', 'data'),

    dataSets: ['minimal-test.json', 'maximal-test.json'],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('a.schemaform-start-button')
            .first()
            .click();
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testKey').then(testKey => {
            if (testKey === 'maximal-test.json') {
              cy.get('va-text-input')
                .shadow()
                .find('input')
                .type('Jane Test Doe');
            } else {
              cy.get('va-text-input')
                .shadow()
                .find('input')
                .type('Jane Doe');
            }
          });

          cy.get(`va-checkbox`)
            .shadow()
            .find('input')
            .check({ force: true });

          cy.findAllByText(/submit/i, { selector: 'button' })
            .first()
            .click();
        });
      },
    },

    setupPerTest: () => {
      // Log in if the form requires an authenticated session.
      // cy.login();
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
