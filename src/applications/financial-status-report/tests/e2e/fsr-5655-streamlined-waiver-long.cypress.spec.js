import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';
import { WIZARD_STATUS } from '../../wizard/constants';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mockUser.json';
import mockStatus from './fixtures/mocks/profile-status.json';
import saveInProgress from './fixtures/mocks/saveInProgress.json';
import debts from './fixtures/mocks/debts.json';
import copays from './fixtures/mocks/copays.json';
import incomeLimit from './fixtures/mocks/incomeLimit.json';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['sw-long-path-minimal-asset'],
    fixtures: { data: path.join(__dirname, 'fixtures', 'data') },

    setupPerTest: () => {
      sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
      cy.intercept('GET', '/v0/feature_toggles**', {
        data: {
          features: [
            { name: 'show_financial_status_report_wizard', value: true },
            { name: 'show_financial_status_report', value: true },
          ],
        },
      });

      cy.intercept('GET', 'income_limits/v1/limitsByZipCode/**', incomeLimit);

      cy.intercept('GET', '/v0/maintenance_windows', []);
      cy.intercept('GET', 'v0/user_transition_availabilities', {
        statusCode: 200,
      });
      cy.login(mockUser);
      cy.intercept('GET', '/v0/profile/status', mockStatus);

      cy.get('@testData').then(testData => {
        cy.intercept('PUT', '/v0/in_progress_forms/5655', testData);
        cy.intercept('GET', '/v0/in_progress_forms/5655', saveInProgress);
      });

      cy.intercept('GET', '/v0/debts', debts);
      cy.intercept('GET', '/v0/medical_copays', copays);

      cy.intercept('POST', '/debts_api/v0/calculate_monthly_expenses', {
        calculatedMonthlyExpenses: '6759',
      });

      cy.intercept('POST', '/debts_api/v0/calculate_monthly_income', {
        totalMonthlyNetIncome: '7951',
      });

      cy.intercept('POST', formConfig.submitUrl, {
        statusCode: 200,
        body: {
          status: 'Document has been successfully uploaded to filenet',
        },
      }).as('submitForm');
    },

    pageHooks: {
      introduction: () => {
        cy.get('a.vads-c-action-link--green')
          .first()
          .click();
      },
      'all-available-debts': ({ afterHook }) => {
        afterHook(() => {
          cy.get(`[data-testid="copay-selection-checkbox"]`)
            .eq(0)
            .shadow()
            .find('input[type=checkbox]')
            .check({ force: true });
          cy.get('.usa-button-primary').click();
        });
      },
      'dependents-count': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#dependent-count')
            .shadow()
            .find('input')
            .type('2');
          cy.get('va-button[data-testid="custom-button-group-button"]')
            .shadow()
            .find('button:contains("Continue")')
            .click();
        });
      },
      'dependent-ages': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#dependentAge-0')
            .shadow()
            .find('input')
            .type('12');
          cy.get('#dependentAge-1')
            .shadow()
            .find('input')
            .type('17');
          cy.get('va-button[data-testid="custom-button-group-button"]')
            .shadow()
            .find('button:contains("Continue")')
            .click();
        });
      },
      'additional-income-checklist': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-checkbox[name="Social Security"]')
            .shadow()
            .find('input')
            .check({ force: true });
          cy.get('.usa-button-primary').click();
        });
      },
      'additional-income-values': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-text-input[name="Social Security"]')
            .first()
            .shadow()
            .find('input')
            .type('4639.90');
          cy.get('.usa-button-primary').click();
        });
      },
      'cash-on-hand': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#cash')
            .first()
            .shadow()
            .find('input')
            .type('125');
          cy.get('.usa-button-primary').click();
        });
      },
      'cash-in-bank': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#cash')
            .first()
            .shadow()
            .find('input')
            .type('329.12');
          cy.get('.usa-button-primary').click();
        });
      },
      'monetary-asset-checklist': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-checkbox')
            .shadow()
            .find('input[type=checkbox]')
            .as('checklist')
            .should('have.length', 5);

          cy.get('@checklist')
            .eq(0)
            .check({ force: true });

          cy.get('@checklist')
            .eq(1)
            .check({ force: true });

          cy.get('.usa-button-primary').click();
        });
      },
      'monetary-asset-values': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-text-input')
            .as('numberInputs')
            .should('have.length', 2);
          cy.get(`[name="U.S. Savings Bonds"]`)
            .shadow()
            .find('input')
            .type('135');
          cy.get(`[name="Retirement accounts (401k, IRAs, 403b, TSP)"]`)
            .shadow()
            .find('input')
            .type('3500');
          cy.get('.usa-button-primary').click();
        });
      },
      'other-income-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-button[data-testid="custom-button-group-button"]')
            .shadow()
            .find('button:contains("Continue")')
            .click();
        });
      },
      'other-expenses-checklist': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-checkbox[name="Clothing"]')
            .shadow()
            .find('input[type="checkbox"]')
            .check({ force: true });

          cy.get('.usa-button-primary').click();
        });
      },
      'other-expenses-values': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-text-input[name="Clothing"]')
            .first()
            .shadow()
            .find('input')
            .type('6759');
          cy.get('.usa-button-primary').click();
        });
      },
      'other-expenses-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-button[data-testid="custom-button-group-button"]')
            .shadow()
            .find('button:contains("Continue")')
            .click();
        });
      },
      'skip-questions-explainer': ({ afterHook }) => {
        afterHook(() => {
          cy.get('h3').should(
            'have.text',
            'You can skip questions on this formWe’re here anytime, day or night – 24/7',
          );
          cy.get('.usa-button-primary').click();
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-accordion-item').should('have.length', 4);
          cy.get('#veteran-signature')
            .shadow()
            .find('input')
            .first()
            .type('Mark Webb');
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
          }).click();
        });
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
