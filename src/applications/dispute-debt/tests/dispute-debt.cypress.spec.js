import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';

import debts from './fixtures/mocks/debts.json';
import mockUser from './fixtures/mocks/user.json';
import mockStatus from './fixtures/mocks/profile-status-response.json';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['minimal-test'],

    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles*', {
        body: {
          data: {
            type: 'feature_toggles',
            features: [{ name: 'dispute_debt', value: true }],
          },
        },
      });
      cy.intercept('GET', '/v0/maintenance_windows', []);
      cy.intercept('GET', 'v0/user_transition_availabilities', {
        statusCode: 200,
      });

      cy.intercept('GET', '/v0/profile/status', mockStatus);

      cy.get('@testData').then(testData => {
        cy.intercept('PUT', '/v0/in_progress_forms/DISPUTE-DEBT', testData);
        cy.intercept('GET', '/v0/in_progress_forms/DISPUTE-DEBT', {
          formData: testData,
          metadata: {
            version: 0,
            prefill: true,
            returnUrl: '/personal-information',
          },
        });
      });

      cy.intercept('GET', '/v0/debts', debts);
      cy.intercept('POST', formConfig.submitUrl, { status: 200 });

      cy.login(mockUser);
    },

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/^start/i, { selector: 'a[href="#start"]' })
            .last()
            .click({ force: true });
        });
      },
      'personal-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('.usa-button-primary').click();
        });
      },
      'contact-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('.usa-button-primary').click();
        });
      },
      'select-debt': ({ afterHook }) => {
        afterHook(() => {
          cy.get('.usa-button-primary').click();
        });
      },
      'existence-or-amount/0': ({ afterHook }) => {
        afterHook(() => {
          cy.get('.usa-button-primary').click();
        });
      },
      'dispute-reason/0': ({ afterHook }) => {
        afterHook(() => {
          cy.get('.usa-button-primary').click();
        });
      },
      'existence-or-amount/1': ({ afterHook }) => {
        afterHook(() => {
          cy.get('.usa-button-primary').click();
        });
      },
      'dispute-reason/1': ({ afterHook }) => {
        afterHook(() => {
          cy.get('.usa-button-primary').click();
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#veteran-signature')
            .shadow()
            .find('input')
            .first()
            .type('Brendan JS Eich');
          cy.get(`va-checkbox[name="veteran-certify"]`)
            .shadow()
            .find('input')
            .check({ force: true });
          cy.get(`va-privacy-agreement`)
            .shadow()
            .find('input')
            .check({ force: true });
          cy.findAllByText(/Submit your request/i, {
            selector: 'button',
          }).click({ force: true });
        });
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
