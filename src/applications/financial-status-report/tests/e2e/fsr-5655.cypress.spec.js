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

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['minimal', 'maximal'],
    fixtures: { data: path.join(__dirname, 'fixtures', 'data') },

    setupPerTest: () => {
      sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
      cy.login(mockUser);
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          features: [
            { name: 'show_financial_status_report_wizard', value: true },
            { name: 'show_financial_status_report', value: true },
            { name: 'combined_financial_status_report', value: false },
            {
              name: 'combined_financial_status_report_enhancements',
              value: false,
            },
          ],
        },
      });
      cy.intercept('GET', '/v0/debts', debts);
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
        cy.get('a.vads-c-action-link--green')
          .first()
          .click();
      },
      'available-debts': ({ afterHook }) => {
        afterHook(() => {
          cy.get(`input[name="request-help-with-debt"]`)
            .first()
            .check();
          cy.get('.usa-button-primary').click();
        });
      },
      'employment-records': ({ afterHook }) => {
        afterHook(() => {
          // Employer One - Current Employment
          cy.get('[data-test-id="employment-type"]')
            .shadow()
            .find('select')
            .select('Full time');
          cy.fillDate('from', '2017-1');
          cy.get(`input[name="current-employment"]`).check();
          cy.get(`input[name="employerName"]`).type('Employer One');
          cy.findAllByText(/Save/i, { selector: 'button' })
            .first()
            .click();
          // Add job link
          cy.get('.add-item-button').click();
          // Employer Two - Previous Employment
          cy.get('[data-test-id="employment-type"]')
            .shadow()
            .find('select')
            .select('Full time');
          cy.fillDate('from', '2015-1');
          cy.fillDate('to', '2017-1');
          cy.get(`input[name="employerName"]`).type('Employer Two');
          cy.findAllByText(/Save/i, { selector: 'button' })
            .first()
            .click();
          cy.get('.usa-button-primary').click();
        });
      },

      'spouse-employment-records': ({ afterHook }) => {
        afterHook(() => {
          // Employer One - Current Employment
          cy.get('[data-test-id="employment-type"]')
            .shadow()
            .find('select')
            .select('Full time');
          cy.fillDate('from', '2015-5');
          cy.get(`input[name="current-employment"]`).check();
          cy.get(`input[name="employerName"]`).type('Employer One');
          cy.findAllByText(/Save/i, { selector: 'button' })
            .first()
            .click();
          // Add job link
          cy.get('.add-item-button').click();
          // Employer Two - Previous Employment
          cy.get('[data-test-id="employment-type"]')
            .shadow()
            .find('select')
            .select('Full time');
          cy.fillDate('from', '2013-2');
          cy.fillDate('to', '2018-3');
          cy.get(`input[name="employerName"]`).type('Employer Two');
          cy.findAllByText(/Save/i, { selector: 'button' })
            .first()
            .click();
          cy.get('.usa-button-primary').click();
        });
      },
      'spouse/income/0': ({ afterHook }) => {
        afterHook(() => {
          cy.get(`#root_spouseGrossSalary`).type('3500');
          cy.get('.usa-button-primary').click();
        });
      },
      'recreational-vehicle-records': ({ afterHook }) => {
        afterHook(() => {
          cy.findByLabelText(/Type of vehicle/)
            .type('Boat')
            .type('{downarrow}{enter}');
          cy.findByLabelText(/Estimated value/)
            .type('2500')
            .type('{downarrow}{enter}');
          cy.get('.usa-button-primary').click();
        });
      },
      'credit-card-bills': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#root_questions_hasCreditCardBillsYes').check();
          cy.get('.usa-button-primary').click();
        });
      },
      'your-credit-card-bills': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#unpaidBalance')
            .first()
            .shadow()
            .find('input')
            .type('100');
          cy.get('#amountDueMonthly')
            .first()
            .shadow()
            .find('input')
            .type('100');
          cy.get('#amountPastDue')
            .first()
            .shadow()
            .find('input')
            .type('100');
          cy.get('.usa-button-primary').click();
        });
      },
      'credit-card-bills-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('.usa-button-primary').click();
        });
      },
      'resolution-options': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-radio-option[value="Waiver"]').click();
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
