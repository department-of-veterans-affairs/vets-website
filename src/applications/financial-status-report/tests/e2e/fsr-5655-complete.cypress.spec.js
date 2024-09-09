import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';
import { WIZARD_STATUS } from '../../wizard/constants';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mockUser.json';
import mockStatus from './fixtures/mocks/profile-status.json';
import debts from './fixtures/mocks/debts.json';
import copays from './fixtures/mocks/copays.json';
import { customButtonGroupContinue } from './fixtures/helpers';
import { employmentInformationLoop } from './pages/EmploymentHistory';
import {
  fillChecklist,
  fillInputList,
  verifySummaryPage,
  verifyEditPage,
} from './pages/ChecklistSummaryFlow';
import { data } from './fixtures/data/fsr-maximal.json';
import {
  otherLivingExpensesOptions,
  otherLivingExpensesList,
} from '../../constants/checkboxSelections';

Cypress.config('waitForAnimations', true);

// using maximal as baseline, so if data structure changes it will reflect in the tests
const {
  additionalIncome,
  assets,
  otherExpenses,
  personalData,
  utilityRecords,
} = data;

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    // starting with no data, so form is filled with navigation
    dataSets: ['initial', 'initial-expenses'],
    fixtures: { data: path.join(__dirname, 'fixtures', 'data') },

    setupPerTest: () => {
      sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);

      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          features: [
            { name: 'show_financial_status_report_wizard', value: true },
            { name: 'show_financial_status_report', value: true },
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
        cy.intercept('GET', '/v0/in_progress_forms/5655', {
          formData: testData,
          metadata: {
            version: 0,
            prefill: true,
            returnUrl: '/veteran-information',
          },
        });
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
      // ============================================================
      // ================== veteranInformationChapter ==================
      // ============================================================
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
      'spouse-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#root_questions_isMarriedYes')
            .should('be.visible')
            .click();
          cy.get('.usa-button-primary').click();
        });
      },
      'spouse-name': ({ afterHook }) => {
        afterHook(() => {
          cy.get('input[name="root_personalData_spouseFullName_first"]').type(
            'Rosemary',
          );
          cy.get('input[name="root_personalData_spouseFullName_last"]').type(
            'Woodhouse',
          );
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
      // ============================================================
      // ================== householdIncomeChapter ==================
      // ============================================================
      'employment-question': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-radio-option[value="true"]').click();
          cy.get('.usa-button-primary').click();
        });
      },
      'enhanced-employment-records': ({ afterHook }) => {
        afterHook(() => {
          // this loop handles the following pages:
          // employment-work-dates
          // gross-monthly-income
          // deduction-checklist
          // deduction-values
          employmentInformationLoop(
            personalData.employmentHistory.veteran.employmentRecords,
          );
        });
      },
      'your-benefits': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[data-testid="mini-summary-card"]')
            .eq(0)
            .find('a')
            .click();

          // edit-benefits - loop gets weird in cypress
          cy.get('#compensationAndPension-benefitAmount')
            .first()
            .shadow()
            .find('input')
            .as('BenefitAmount');
          cy.get('@BenefitAmount').clear();
          cy.get('@BenefitAmount').type('1015.23');
          customButtonGroupContinue('Update');
          cy.get('[data-testid="mini-summary-card"]')
            .eq(0)
            .find('p')
            .should('contain', '$1,015.23');
          cy.get('.usa-button-primary').click();
        });
      },
      'additional-income-checklist': ({ afterHook }) => {
        afterHook(() => {
          // get veteran additional income array
          const { addlIncRecords } = additionalIncome;
          fillChecklist(addlIncRecords);
          cy.get('.usa-button-primary').click();
        });
      },
      'additional-income-values': ({ afterHook }) => {
        afterHook(() => {
          const { addlIncRecords } = additionalIncome;
          fillInputList(addlIncRecords);
          cy.get('.usa-button-primary').click();
        });
      },
      'other-income-summary': ({ afterHook }) => {
        afterHook(() => {
          const { addlIncRecords } = additionalIncome;
          verifySummaryPage(addlIncRecords);

          // add-other-income
          verifyEditPage(
            additionalIncome.addlIncRecords,
            'Update other income',
          );
          customButtonGroupContinue();
        });
      },
      'enhanced-spouse-employment-question': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-radio-option[value="true"]').click();
          cy.get('.usa-button-primary').click();
        });
      },
      'enhanced-spouse-employment-records': ({ afterHook }) => {
        afterHook(() => {
          // this loop handles the following pages:
          // spouse-employment-work-dates
          // spouse-employment-history
          // spouse-gross-monthly-income
          // spouse-deduction-checklist
          // spouse-deduction-values
          employmentInformationLoop(
            personalData.employmentHistory.spouse.spEmploymentRecords,
          );
        });
      },
      'spouse-benefits': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#root_questions_spouseHasBenefitsYes')
            .should('be.visible')
            .click();
          cy.get('.usa-button-primary').click();
        });
      },
      'spouse-benefit-records': ({ afterHook }) => {
        afterHook(() => {
          cy.get(
            'input[name="root_benefits_spouseBenefits_compensationAndPension"]',
          ).type('165.21');
          cy.get('input[name="root_benefits_spouseBenefits_education"]').type(
            '0',
          );
          cy.get('.usa-button-primary').click();
        });
      },
      'spouse-additional-income-checklist': ({ afterHook }) => {
        afterHook(() => {
          // get spouse additional income array
          const { spouse } = additionalIncome;
          fillChecklist(spouse.spAddlIncome);
          cy.get('.usa-button-primary').click();
        });
      },
      'spouse-additional-income-values': ({ afterHook }) => {
        afterHook(() => {
          const { spouse } = additionalIncome;
          fillInputList(spouse.spAddlIncome);
          cy.get('.usa-button-primary').click();
        });
      },
      'spouse-other-income-summary': ({ afterHook }) => {
        afterHook(() => {
          const { spouse } = additionalIncome;
          verifySummaryPage(spouse.spAddlIncome);

          // add-other-income
          verifyEditPage(spouse.spAddlIncome, 'Update other income');
          customButtonGroupContinue();
        });
      },
      // ============================================================
      // ================== householdAssetsChapter ==================
      // ============================================================
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
          cy.get('@testData').then(testData => {
            const monetaryAssetChecklistLength = testData[
              'view:streamlinedWaiverAssetUpdate'
            ]
              ? 5
              : 8;
            cy.get('va-checkbox')
              .shadow()
              .find('input[type=checkbox]')
              .as('checklist')
              .should('have.length', monetaryAssetChecklistLength);
          });

          // Check specific checkboxes
          cy.get('va-checkbox')
            .eq(0)
            .shadow()
            .find('input[type=checkbox]')
            .check({ force: true });

          cy.get('va-checkbox')
            .eq(1)
            .shadow()
            .find('input[type=checkbox]')
            .check({ force: true });

          // Proceed with form submission
          cy.get('.usa-button-primary').click();
        });
      },
      'monetary-asset-values': ({ afterHook }) => {
        afterHook(() => {
          // do U.S. Savings Bonds, and Retirement
          cy.get('va-text-input')
            .as('numberInputs')
            .should('have.length', 2);

          // check testData to see if assets feature flag is true to udpate the length the checkbox should be
          cy.get('@testData').then(testData => {
            if (testData['view:streamlinedWaiverAssetUpdate']) {
              cy.get('[id="U.S. Savings Bonds0"]')
                .first()
                .shadow()
                .find('input')
                .type('1000');
              cy.get('[id="Retirement accounts (401k, IRAs, 403b, TSP)1"]')
                .first()
                .shadow()
                .find('input')
                .type('1500');
            } else {
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
            }
          });
          cy.get('.usa-button-primary').click();
        });
      },
      'enhanced-real-estate-assets': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#root_questions_hasRealEstateYes').click();
          cy.get('.usa-button-primary').click();
        });
      },
      'enhanced-real-estate-asset-records': ({ afterHook }) => {
        afterHook(() => {
          cy.get('input[name="root_assets_realEstateValue"]').type('180000');
          cy.get('.usa-button-primary').click();
        });
      },
      // linting doesn't like paths that don't have a - in them
      // eslint-disable-next-line no-useless-computed-key
      ['vehicles']: ({ afterHook }) => {
        afterHook(() => {
          cy.get('#root_questions_hasVehicleYes')
            .should('be.visible')
            .click();
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
          cy.get('va-button[data-testid="custom-button-group-button"]')
            .shadow()
            .find('button:contains("Continue")')
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
      'recreational-vehicles': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#root_questions_hasRecreationalVehicleYes')
            .should('be.visible')
            .click();
          cy.get('.usa-button-primary').click();
        });
      },
      'recreational-vehicle-records': ({ afterHook }) => {
        afterHook(() => {
          cy.get('input[name="root_assets_recVehicleAmount"]').type('2500');
          cy.get('.usa-button-primary').click();
        });
      },
      'other-assets-checklist': ({ afterHook }) => {
        afterHook(() => {
          // get other assets array
          const { otherAssets } = assets;
          fillChecklist(otherAssets);
          cy.get('.usa-button-primary').click();
        });
      },
      'other-assets-values': ({ afterHook }) => {
        afterHook(() => {
          // get other assets array
          const { otherAssets } = assets;
          fillInputList(otherAssets);
          cy.get('.usa-button-primary').click();
        });
      },
      'other-assets-summary': ({ afterHook }) => {
        afterHook(() => {
          // get other assets array
          const { otherAssets } = assets;
          verifySummaryPage(otherAssets);

          // add-other-asset
          verifyEditPage(otherAssets, 'Update asset');
          customButtonGroupContinue();
        });
      },
      // ==============================================================
      // ================== householdExpensesChapter ==================
      // ==============================================================
      'household-expenses-checklist': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-checkbox')
            .shadow()
            .find('input[type="checkbox"]')
            .should('exist');
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
      // only shows if showUpdatedExpensePages is active
      'monthly-housing-expenses': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-text-input')
            .first()
            .shadow()
            .find('input')
            .type('1200');
          cy.get('.usa-button-primary').click();
        });
      },
      'utility-bill-checklist': ({ afterHook }) => {
        afterHook(() => {
          fillChecklist(utilityRecords);
          cy.get('.usa-button-primary').click();
        });
      },
      'utility-bill-values': ({ afterHook }) => {
        afterHook(() => {
          fillInputList(utilityRecords);
          cy.get('.usa-button-primary').click();
        });
      },
      'utility-bill-summary': ({ afterHook }) => {
        afterHook(() => {
          verifySummaryPage(utilityRecords);

          // add-utility-bill
          verifyEditPage(utilityRecords, 'Update utility bill');
          cy.get('.usa-button-primary').click();
        });
      },
      'credit-card-bills': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#root_questions_hasCreditCardBillsYes')
            .should('be.visible')
            .click();
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
          cy.get('va-button[data-testid="custom-button-group-button"]')
            .shadow()
            .find('button:contains("Continue")')
            .click();
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
      'installment-contracts': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#root_questions_hasRepaymentsYes')
            .should('be.visible')
            .click();
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
          cy.get('va-button[data-testid="custom-button-group-button"]')
            .shadow()
            .find('button:contains("Continue")')
            .click();
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
      'other-expenses-checklist': ({ afterHook }) => {
        afterHook(() => {
          // Check the length of checkboxes based on the feature flag
          cy.get('@testData').then(testData => {
            const otherExpenseChecklistLength = testData[
              'view:showUpdatedExpensePages'
            ]
              ? otherLivingExpensesList.length
              : otherLivingExpensesOptions.length;

            cy.get('va-checkbox')
              .shadow()
              .find('input[type=checkbox]')
              .as('checklist')
              .should('have.length', otherExpenseChecklistLength);
          });

          // Iterate through otherExpenses and check each checkbox
          otherExpenses.forEach(expense => {
            cy.get(`va-checkbox[name="${expense.name}"]`)
              .shadow()
              .find('input[type="checkbox"]')
              .check({ force: true });
          });

          // Click the primary button to proceed
          cy.get('.usa-button-primary').click();
        });
      },
      'other-expenses-values': ({ afterHook }) => {
        afterHook(() => {
          fillInputList(otherExpenses);
          cy.get('.usa-button-primary').click();
        });
      },
      'other-expenses-summary': ({ afterHook }) => {
        afterHook(() => {
          verifySummaryPage(otherExpenses);

          // add-other-expense
          verifyEditPage(otherExpenses, 'Update expense');
          customButtonGroupContinue();
        });
      },
      // ==============================================================
      // ================== resolutionOptionsChapter ==================
      // ==============================================================
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
      // ==============================================================
      // ================ bankruptcyAttestationChapter ================
      // ==============================================================
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
          cy.get('va-button[data-testid="custom-button-group-button"]')
            .shadow()
            .find('button:contains("Continue")')
            .click();
        });
      },
      // ============================================================
      // ======================== Review page =======================
      // ============================================================
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
          }).click();
        });
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
