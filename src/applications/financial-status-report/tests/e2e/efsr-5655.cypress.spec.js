import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';
import { WIZARD_STATUS } from '../../wizard/constants';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mockUser.json';
import mockStatus from './fixtures/mocks/profile-status.json';
import saveInProgress from './fixtures/mocks/saveInProgress.json';
import debts from './fixtures/mocks/debts.json';
import copays from './fixtures/mocks/copays.json';
import EnhancedVeteranEmploymentHistory from './pages/employment/EnhancedVeteranEmploymentHistory';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['efsr-maximal'],
    fixtures: { data: path.join(__dirname, 'fixtures', 'data') },

    setupPerTest: () => {
      sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          features: [
            { name: 'show_financial_status_report_wizard', value: true },
            { name: 'show_financial_status_report', value: true },
            {
              name: 'combined_financial_status_report_enhancements',
              value: true,
            },
          ],
        },
      });

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
      'enhanced-spouse-employment-records': ({ afterHook }) => {
        afterHook(() => {
          EnhancedVeteranEmploymentHistory.fillEmployerInfo();
        });
      },
      'spouse-gross-monthly-income': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#gross-monthly-income')
            .first()
            .shadow()
            .find('input')
            .type('1000');
          cy.get('.usa-button-primary').click();
        });
      },
      'spouse-deduction-checklist': ({ afterHook }) => {
        afterHook(() => {
          cy.get(`input[name="State tax"]`)
            .first()
            .check();
          EnhancedVeteranEmploymentHistory.attemptNextPage();
        });
      },
      'spouse-deduction-values': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#State\\ tax0')
            .first()
            .shadow()
            .find('input')
            .type('123');
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
            .first()
            .shadow()
            .find('button')
            .contains('Continue')
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
            .first()
            .shadow()
            .find('button')
            .contains('Continue')
            .click();
        });
      },
      'monetary-asset-checklist': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[type=checkbox]')
            .as('checklist')
            .should('have.length', 8);
          cy.get('@checklist')
            .eq(0)
            .click();
          cy.get('@checklist')
            .eq(1)
            .click();
          cy.get('.usa-button-primary').click();
        });
      },
      'monetary-asset-values': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-number-input')
            .as('numberInputs')
            .should('have.length', 2);
          cy.get('#Cash0')
            .first()
            .shadow()
            .find('input')
            .type('1000');
          cy.get('[id="Checking accounts1"]')
            .first()
            .shadow()
            .find('input')
            .type('1500');
          cy.get('.usa-button-primary').click();
        });
      },
      'your-vehicle-records': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#add-make-name')
            .first()
            .shadow()
            .find('input')
            .type('Ford');
          cy.get('#add-model-name')
            .first()
            .shadow()
            .find('input')
            .type('Ranger');
          cy.get('#year')
            .first()
            .shadow()
            .find('input')
            .type('2003');
          cy.get('#estValue')
            .first()
            .shadow()
            .find('input')
            .type('1500');
          cy.findAllByText(/Continue/i, { selector: 'button' })
            .first()
            .click({ waitForAnimations: true });
        });
      },
      'vehicles-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[data-testid="mini-summary-card"]')
            .as('cards')
            .should('have.length', 1);
          cy.get('@cards')
            .eq(0)
            .should('contain', 'Ford')
            .and('contain', 'Ranger')
            .and('contain', '2003')
            .and('contain', '$1,500.00');
          cy.get('.usa-button-primary').click();
        });
      },
      'recreational-vehicle-records': ({ afterHook }) => {
        afterHook(() => {
          cy.findByLabelText(
            /What is the estimated value of all of your trailers, campers, and boats?/,
          ).type('2500');
          cy.get('.usa-button-primary').click();
        });
      },
      'other-assets-checklist': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[type=checkbox]')
            .as('checklist')
            .should('have.length', 6);
          cy.get('@checklist')
            .eq(0)
            .click();
          cy.get('@checklist')
            .eq(1)
            .click();
          cy.get('.usa-button-primary').click();
        });
      },
      'other-assets-values': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-number-input')
            .as('numberInputs')
            .should('have.length', 2);
          cy.get('#Antiques0')
            .first()
            .shadow()
            .find('input')
            .type('1000');
          cy.get('[id="Collectibles, or collection(s)1"]')
            .first()
            .shadow()
            .find('input')
            .type('1500');
          cy.get('.usa-button-primary').click();
        });
      },
      'other-assets-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[data-testid="mini-summary-card"]')
            .as('cards')
            .should('have.length', 2);
          cy.get('@cards')
            .eq(0)
            .should('contain', 'Antiques')
            .and('contain', '$1,000.00');
          cy.get('@cards')
            .eq(1)
            .should('contain', 'Collectibles')
            .and('contain', '$1,500.00');
          cy.get('.usa-button-primary').click();
        });
      },
      'utility-bill-checklist': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[type=checkbox]')
            .as('checklist')
            .should('have.length', 6);
          cy.get('@checklist')
            .eq(0)
            .click();
          cy.get('@checklist')
            .eq(1)
            .click();
          cy.get('.usa-button-primary').click();
        });
      },
      'utility-bill-values': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-number-input')
            .as('numberInputs')
            .should('have.length', 2);
          cy.get('#Electricity0')
            .first()
            .shadow()
            .find('input')
            .type('1000');
          cy.get('[id="Gas1"]')
            .first()
            .shadow()
            .find('input')
            .type('1500');
          cy.get('.usa-button-primary').click();
        });
      },
      'utility-bill-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[data-testid="mini-summary-card"]')
            .as('cards')
            .should('have.length', 2);
          cy.get('@cards')
            .eq(0)
            .should('contain', 'Electricity')
            .and('contain', '$1,000.00');
          cy.get('@cards')
            .eq(1)
            .should('contain', 'Gas')
            .and('contain', '$1,500.00');
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
            .type('25');
          cy.get('#amountPastDue')
            .first()
            .shadow()
            .find('input')
            .type('10');
          cy.findAllByText(/Continue/i, { selector: 'button' })
            .first()
            .click();
          // cy.get('.usa-button-primary').click();
        });
      },
      'credit-card-bills-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[data-testid="mini-summary-card"]')
            .as('cards')
            .should('have.length', 1);
          cy.get('@cards')
            .eq(0)
            .should('contain', 'Unpaid balance: $100.00')
            .and('contain', 'Minimum monthly payment amount: $25.00')
            .and('contain', 'Amount overdue: $10.00');
          cy.get('.usa-button-primary').click();
        });
      },
      'your-installment-contracts': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#contractType')
            .shadow()
            .find('input')
            .type('Installment Contract Type');
          cy.get('#creditorName')
            .shadow()
            .find('input')
            .type('Installment Contract Name');
          cy.get('#originalAmount')
            .first()
            .shadow()
            .find('input')
            .type('10000');
          cy.get('#unpaidBalance')
            .first()
            .shadow()
            .find('input')
            .type('1000');
          cy.get('#amountDueMonthly')
            .first()
            .shadow()
            .find('input')
            .type('100');
          cy.get('[data-testid="loanBegan"]')
            .shadow()
            .find('va-select')
            .first()
            .shadow()
            .find('select')
            .select('January');
          cy.get('[data-testid="loanBegan"]')
            .shadow()
            .find('va-text-input')
            .first()
            .shadow()
            .find('input')
            .type('2010');
          cy.get('#amountPastDue')
            .first()
            .shadow()
            .find('input')
            .type('10');
          cy.findAllByText(/Continue/i, {
            selector: 'button',
          })
            .first()
            .click();
          // cy.get('.usa-button-primary').click();
        });
      },
      'installment-contracts-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[data-testid="mini-summary-card"]')
            .as('cards')
            .should('have.length', 1);
          cy.get('@cards')
            .eq(0)
            .should('contain', 'Creditor: Installment Contract Name')
            .and('contain', 'Original Loan Amount: $10,000.00')
            .and('contain', 'Unpaid balance: $1,000.00')
            .and('contain', 'Minimum monthly payment amount: $100.00')
            .and('contain', 'Date received: 01/XX/2010')
            .and('contain', 'Amount overdue: $10.00');
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
          cy.get('.usa-button-primary').click();
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
