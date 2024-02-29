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
import VeteranEmploymentHistory from './pages/employment/VeteranEmploymentHistory';
import SpouseEmploymentHistory from './pages/employment/SpouseEmploymentHistory';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['maximal', 'minimal'],
    fixtures: { data: path.join(__dirname, 'fixtures', 'data') },
    skip: true, // leaving in until we finish deprecating the legacy pages
    setupPerTest: () => {
      sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
      cy.login(mockUser);
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          features: [
            { name: 'show_financial_status_report_wizard', value: true },
            { name: 'show_financial_status_report', value: true },
            {
              name: 'combined_financial_status_report_enhancements',
              value: false,
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
        cy.get('.vads-c-action-link--green')
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
      'employment-records': ({ afterHook }) => {
        afterHook(() => {
          VeteranEmploymentHistory.fillEmployerInfo();
          VeteranEmploymentHistory.attemptNextPage();
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
      'recreational-vehicle-records': ({ afterHook }) => {
        afterHook(() => {
          cy.findByLabelText(
            /What is the estimated value of all of your trailers, campers, and boats?/,
          )
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
      'resolution-option/0': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[type="radio"][value="monthly"]').click();
          cy.get('.usa-button-primary').click();
        });
      },
      'resolution-comment/0': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[data-testid="resolution-amount"]')
            .first()
            .shadow()
            .find('input')
            .type('10.00');
          cy.get('.usa-button-primary').click();
        });
      },
      'resolution-option/1': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[type="radio"][value="waiver"]').click();
          cy.get('.usa-button-primary').click();
        });
      },
      'resolution-waiver-agreement/1': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[type=checkbox]').check();
          cy.get('.usa-button-primary').click();
        });
      },
      'resolution-comments': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#resolution-comments')
            .shadow()
            .find('textarea')
            .type('Some Resolution Comments . . .');
          cy.get('va-button[data-testid="custom-button-group-button"]')
            .shadow()
            .find('button:contains("Continue")')
            .click();
        });
      },
      'bankruptcy-history': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#has-declared-bankruptcy').click();
          cy.get('.usa-button-primary').click();
        });
      },
      'enhanced-bankruptcy-history-records': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[data-testid="date-discharged"]')
            .shadow()
            .find('va-select')
            .first()
            .shadow()
            .find('select')
            .select('January');
          cy.get('[data-testid="date-discharged"]')
            .shadow()
            .find('va-text-input')
            .first()
            .shadow()
            .find('input')
            .type('2010');
          cy.get('#court-location')
            .first()
            .shadow()
            .find('input')
            .type('Miami, FL');
          cy.get('#docket-number')
            .first()
            .shadow()
            .find('input')
            .type('ABC123');
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
