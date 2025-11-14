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
          cy.findByTestId('dob-display').should('exist');

          // Should match dob from user.json
          cy.findByTestId('dob-display').should('contain', 'October 4, 1950');
          cy.findByTestId('ssn-display').should('exist');
          cy.get('.usa-button-primary').click();
        });
      },
      'contact-information': ({ afterHook }) => {
        afterHook(() => {
          // TOO: add checks for contact information fields
          cy.get('.usa-button-primary').click();
        });
      },
      'select-debt': ({ afterHook }) => {
        afterHook(() => {
          cy.get(`[data-testid="debt-selection-checkbox"]`)
            .as('Debts')
            .should('have.length', 3);

          // Just want to make sure we have at least one compensation debt
          //  since it gets its own pdf. We also include two others to confirm
          //  pdf iteration functionality.
          cy.get('@Debts')
            .eq(0)
            .shadow()
            .find('span')
            .should('contain', 'compensation');

          cy.get('@Debts')
            .eq(0)
            .shadow()
            .find('input[type=checkbox]')
            .check();
          cy.get('@Debts')
            .eq(1)
            .shadow()
            .find('input[type=checkbox]')
            .check();
          cy.get('@Debts')
            .eq(2)
            .shadow()
            .find('input[type=checkbox]')
            .check();
          cy.get('.usa-button-primary').click();
        });
      },

      // Comp & Pen
      'existence-or-amount/0': ({ afterHook }) => {
        afterHook(() => {
          cy.get('h3').should(
            'contain',
            'Debt 1 of 3: $100.00 Disability compensation and pension overpayment',
          );

          cy.get(
            'va-radio-option[value="I don\'t think I owe this debt to VA"]',
          ).click();
          cy.get('.usa-button-primary').click();
        });
      },
      'dispute-reason/0': ({ afterHook }) => {
        afterHook(() => {
          cy.get('h3').should(
            'contain',
            'Debt 1 of 3: $100.00 Disability compensation and pension overpayment',
          );

          cy.get('va-textarea')
            .shadow()
            .find('textarea')
            .type('Dispute reason for comp & pen debt', { force: true });
          cy.get('.usa-button-primary').click();
        });
      },

      // Books/Supplies
      'existence-or-amount/1': ({ afterHook }) => {
        afterHook(() => {
          cy.get('h3').should(
            'contain',
            'Debt 2 of 3: $120.40 Post-9/11 GI Bill overpayment for books and supplies',
          );

          cy.get(
            'va-radio-option[value="I don\'t think the amount is correct on this debt"]',
          ).click();
          cy.get('.usa-button-primary').click();
        });
      },
      'dispute-reason/1': ({ afterHook }) => {
        afterHook(() => {
          cy.get('h3').should(
            'contain',
            'Debt 2 of 3: $120.40 Post-9/11 GI Bill overpayment for books and supplies',
          );

          cy.get('va-textarea')
            .shadow()
            .find('textarea')
            .type('Dispute reason for books/supplies debt', { force: true });
          cy.get('.usa-button-primary').click();
        });
      },

      // Tuition
      'existence-or-amount/2': ({ afterHook }) => {
        afterHook(() => {
          cy.get('h3').should(
            'contain',
            'Debt 3 of 3: $1,000.00 Post-9/11 GI Bill overpayment for tuition',
          );

          cy.get(
            'va-radio-option[value="I don\'t think I owe this debt to VA"]',
          ).click();
          cy.get('.usa-button-primary').click();
        });
      },
      'dispute-reason/2': ({ afterHook }) => {
        afterHook(() => {
          cy.get('h3').should(
            'contain',
            'Debt 3 of 3: $1,000.00 Post-9/11 GI Bill overpayment for tuition',
          );

          cy.get('va-textarea')
            .shadow()
            .find('textarea')
            .type('Dispute reason for tuition debt', { force: true });
          cy.get('.usa-button-primary').click();
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.findByText(/Submit/i, { selector: 'button' }).click();
        });
      },
      confirmation: ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-alert[status="success"]')
            .should('be.visible')
            .find('h2')
            .should('contain', 'Your dispute submission is in progress');

          cy.get('va-button')
            .shadow()
            .find('button')
            .should('contain', 'Print this page')
            .and('be.visible');

          cy.findByText('Veteran’s personal information').should('exist');
          cy.findByText('Debt Selection').should('exist');

          cy.findByText('What to expect').should('exist');

          cy.findByText('How to contact us if you have questions').should(
            'exist',
          );

          cy.findByText('Need help?').should('exist');
        });
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
