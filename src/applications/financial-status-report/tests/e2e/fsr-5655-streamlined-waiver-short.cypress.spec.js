import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mockUser.json';
import mockStatus from './fixtures/mocks/profile-status.json';
import debts from './fixtures/mocks/debts.json';
import copays from './fixtures/mocks/copays.json';
import incomeLimit from './fixtures/mocks/incomeLimit.json';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['sw-short-path-minimal-asset'],
    fixtures: { data: path.join(__dirname, 'fixtures', 'data') },

    setupPerTest: () => {
      sessionStorage.setItem('wizardStatus', WIZARD_STATUS_COMPLETE);
      cy.intercept('GET', '/v0/feature_toggles**', {
        data: {
          features: [
            { name: 'show_financial_status_report_wizard', value: true },
            { name: 'show_financial_status_report', value: true },
            {
              name: 'show_financial_status_report_streamlined_waiver',
              value: true,
            },
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
        cy.intercept('GET', '/v0/in_progress_forms/5655', {
          formData: testData,
          metadata: {
            version: 0,
            prefill: true,
            returnUrl: '/veteran-information',
          },
        });
      });

      cy.intercept('POST', '/debts_api/v0/calculate_monthly_income', {
        totalMonthlyNetIncome: 0.0,
      });

      cy.intercept('GET', '/v0/debts', debts);
      cy.intercept('GET', '/v0/medical_copays', copays);

      cy.intercept('POST', formConfig.submitUrl, {
        statusCode: 200,
        body: {
          status: 'Document has been successfully uploaded to filenet',
        },
      }).as('submitForm');
    },

    pageHooks: {
      introduction: () => {
        cy.clickStartForm();
      },
      'dependents-count': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-button[data-testid="custom-button-group-button"]')
            .shadow()
            .find('button:contains("Continue")')
            .click({ force: true });
        });
      },
      'dependent-ages': ({ afterHook }) => {
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
            'contain.text',
            'You can skip questions on this formWe’re here anytime, day or night – 24/7',
          );
          cy.clickFormContinue();
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-accordion-item').should('have.length', 3);
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
          cy.clickFormContinue();
        });
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
