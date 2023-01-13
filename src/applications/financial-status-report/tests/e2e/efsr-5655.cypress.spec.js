import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';
import { WIZARD_STATUS } from '../../wizard/constants';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mockUser.json';
import saveInProgress from './fixtures/mocks/saveInProgress.json';
import debts from './fixtures/mocks/debts.json';
import copays from './fixtures/mocks/copays.json';
import EnhancedVeteranEmploymentHistory from './pages/employment/EnhancedVeteranEmploymentHistory';
import SpouseEmploymentHistory from './pages/employment/SpouseEmploymentHistory';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['cfsr-maximal'],
    fixtures: { data: path.join(__dirname, 'fixtures', 'data') },

    setupPerTest: () => {
      sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
      cy.login(mockUser);
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          features: [
            { name: 'show_financial_status_report_wizard', value: true },
            { name: 'show_financial_status_report', value: true },
            { name: 'combined_financial_status_report', value: true },
            {
              name: 'combined_financial_status_report_enhancements',
              value: true,
            },
          ],
        },
      });
      cy.intercept('GET', '/v0/debts', debts);
      cy.intercept('GET', '/v0/medical_copays', copays);
      cy.get('@testData').then(testData => {
        cy.intercept('PUT', '/v0/in_progress_forms/5655', testData);
        cy.intercept('GET', '/v0/in_progress_forms/5655', saveInProgress);
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
        cy.findAllByText(/start/i, { selector: 'button' })
          .first()
          .click();
      },
      'all-available-debts': ({ afterHook }) => {
        afterHook(() => {
          cy.get(`input[name="request-help-with-debt"]`)
            .first()
            .check();
          cy.get(`input[name="request-help-with-copay"]`)
            .first()
            .check();
          cy.get('.usa-button-primary').click();
        });
      },
      'enhanced-employment-records': ({ afterHook }) => {
        afterHook(() => {
          EnhancedVeteranEmploymentHistory.fillEmployerInfo();
        });
      },
      'gross-monthly-income': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#gross-monthly-income')
            .first()
            .shadow()
            .find('input')
            .type('1000');
          cy.get('.usa-button-primary').click();
        });
      },
      'deduction-checklist': ({ afterHook }) => {
        afterHook(() => {
          EnhancedVeteranEmploymentHistory.goBackAndValidateInput(
            '[data-testid="gross-monthly-income"]',
            '1000',
          );

          // continuing to deduction checklist
          EnhancedVeteranEmploymentHistory.attemptNextPage();

          cy.get(`input[name="State tax"]`)
            .first()
            .check();
          EnhancedVeteranEmploymentHistory.attemptNextPage();
        });
      },
      'deduction-values': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#State\\ tax0')
            .first()
            .shadow()
            .find('input')
            .type('123');
          cy.get('.usa-button-primary').click();
        });
      },
      'household-expenses-checklist': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#Rent0').check();
          cy.get('.usa-button-primary').click();
        });
      },
      'household-expenses-values': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#Rent0')
            .first()
            .shadow()
            .find('input')
            .type('123');
          cy.get('.usa-button-primary').click();
        });
      },
      'spouse-employment-records': ({ afterHook }) => {
        afterHook(() => {
          SpouseEmploymentHistory.fillEmployerInfo();
          SpouseEmploymentHistory.attemptNextPage();
        });
      },
      'spouse/income/0': ({ afterHook }) => {
        afterHook(() => {
          cy.get(`#root_spouseGrossSalary`).type('3500');
          cy.get('.usa-button-primary').click();
        });
      },
      'cfsr-recreational-vehicle-records': ({ afterHook }) => {
        afterHook(() => {
          cy.findByLabelText(
            /What is the estimated value of all of your trailers, campers, and boats?/,
          )
            .type('2500')
            .type('{downarrow}{enter}');
          cy.get('.usa-button-primary').click();
        });
      },
      'resolution-option/0': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[type="radio"][value="monthly"]').click();
          cy.get('.usa-button-primary').click();
        });
      },
      'resolution-comment/0': ({ afterHook }) => {
        afterHook(() => {
          cy.get(`#root_resolutionComment`).type('10.00');
          cy.get('.usa-button-primary').click();
        });
      },
      'resolution-option/1': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[type="radio"][value="waiver"]').click();
          cy.get('[type="checkbox"]').click();
          cy.get('.usa-button-primary').click();
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#veteran-signature')
            .shadow()
            .find('input')
            .first()
            .type('Mark Webb');
          cy.get(`input[name="veteran-certify"]`).check();
          cy.get(`input[name="privacy-policy"]`).check();
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
