// Test file for form 21P-601 (Application for Accrued Amounts Due a Deceased Beneficiary)

import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import {
  selectYesNoWebComponent,
  fillTextWebComponent,
  fillFullNameWebComponentPattern,
  fillDateWebComponentPattern,
  fillTextAreaWebComponent,
  selectDropdownWebComponent,
  selectCheckboxGroupWebComponent,
  reviewAndSubmitPageFlow,
} from '../../shared/tests/e2e/helpers';

import formConfig from '../config/form';
import manifest from '../manifest.json';

// Mock data
import mockUser from './e2e/fixtures/mocks/user.json';
import mockSipGet from './e2e/fixtures/mocks/sip-get.json';
import mockSipPut from './e2e/fixtures/mocks/sip-put.json';
import mockFeatureToggles from './e2e/fixtures/mocks/featureToggles.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'e2e', 'fixtures', 'data'),
    dataSets: [
      'minimal-test',
      'test-beneficiary-not-veteran',
      'test-data-child',
      'test-data-creditor',
      'test-data-executor',
      'test-data-parent',
      'test-data-spouse',
    ],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/Apply for accrued benefits/i, { selector: 'a' })
            .first()
            .click();
        });
      },

      'already-filed': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectYesNoWebComponent('hasAlreadyFiled', data.hasAlreadyFiled);
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'unpaid-creditors': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectYesNoWebComponent(
              'hasUnpaidCreditors',
              data.hasUnpaidCreditors,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'veteran-name': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillFullNameWebComponentPattern(
              'veteranFullName',
              data.veteranFullName,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'veteran-identifiers': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent(
              'veteranIdentification_ssn',
              data.veteranIdentification.ssn,
            );
            if (data.veteranIdentification.vaFileNumber) {
              fillTextWebComponent(
                'veteranIdentification_vaFileNumber',
                data.veteranIdentification.vaFileNumber,
              );
            }
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'beneficiary-is-veteran': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectYesNoWebComponent(
              'beneficiaryIsVeteran',
              data.beneficiaryIsVeteran,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'beneficiary-name': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.beneficiaryFullName) {
              fillFullNameWebComponentPattern(
                'beneficiaryFullName',
                data.beneficiaryFullName,
              );
            }
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'beneficiary-date-of-death': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillDateWebComponentPattern(
              'beneficiaryDateOfDeath',
              data.beneficiaryDateOfDeath,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'your-personal-information': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillFullNameWebComponentPattern(
              'claimantFullName',
              data.claimantFullName,
            );
            fillTextWebComponent(
              'claimantIdentification_ssn',
              data.claimantIdentification.ssn,
            );
            fillDateWebComponentPattern(
              'claimantDateOfBirth',
              data.claimantDateOfBirth,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'your-contact-information': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillAddressWebComponentPattern(
              'claimantAddress',
              data.claimantAddress,
            );
            // Fill contact info
            fillTextWebComponent('claimantPhone', data.claimantPhone);
            if (data.claimantEmail) {
              fillTextWebComponent('claimantEmail', data.claimantEmail);
            }
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'your-relationship': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectDropdownWebComponent(
              'relationshipToDeceased',
              data.relationshipToDeceased,
            );
            if (data.wantsToWaiveSubstitution !== undefined) {
              selectYesNoWebComponent(
                'wantsToWaiveSubstitution',
                data.wantsToWaiveSubstitution,
              );
            }
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'surviving-relatives': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            const relativesData = {
              hasSpouse: data.survivors.hasSpouse || false,
              hasChildren: data.survivors.hasChildren || false,
              hasParents: data.survivors.hasParents || false,
              hasNone: data.survivors.hasNone || false,
            };
            cy.selectVaCheckbox(
              `consent-checkbox`,
              data.consentToMailMissingRequiredFiles,
            );
            selectCheckboxGroupWebComponent(relativesData);

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'relatives-information': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.survivingRelatives && data.survivingRelatives.length > 0) {
              data.survivingRelatives.forEach((relative, index) => {
                // Add relative
                if (index > 0) {
                  cy.findByText(/Add another relative/i, {
                    selector: 'button',
                  }).click();
                }

                // Fill relative information
                fillFullNameWebComponentPattern(
                  `survivingRelatives_${index}_fullName`,
                  relative.fullName,
                );
                selectDropdownWebComponent(
                  `survivingRelatives_${index}_relationship`,
                  relative.relationship,
                );
                fillDateWebComponentPattern(
                  `survivingRelatives_${index}_dateOfBirth`,
                  relative.dateOfBirth,
                );
                cy.fillAddressWebComponentPattern(
                  `survivingRelatives_${index}_address`,
                  relative.address,
                );
              });
            }
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'reimbursement-claim': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectYesNoWebComponent(
              'claimingReimbursement',
              data.claimingReimbursement,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'expenses-list': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.expenses && data.expenses.length > 0) {
              data.expenses.forEach((expense, index) => {
                if (index > 0) {
                  cy.get('va-button[text*="Add another"]').click();
                }

                fillTextWebComponent(
                  `expenses_${index}_provider`,
                  expense.provider,
                );
                fillTextWebComponent(
                  `expenses_${index}_expenseType`,
                  expense.expenseType,
                );
                fillTextWebComponent(
                  `expenses_${index}_amount`,
                  expense.amount,
                );
              });
            }
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'other-debts': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectYesNoWebComponent('hasOtherDebts', data.hasOtherDebts);
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'other-debts-list': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.otherDebts && data.otherDebts.length > 0) {
              data.otherDebts.forEach((debt, index) => {
                if (index > 0) {
                  cy.get('va-button[text*="Add another"]').click();
                }

                fillTextWebComponent(
                  `otherDebts_${index}_debtType`,
                  debt.debtType,
                );
                fillTextWebComponent(`otherDebts_${index}_amount`, debt.amount);
                fillTextWebComponent(
                  `otherDebts_${index}_creditorName`,
                  debt.creditorName,
                );
              });
            }
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'additional-info/remarks': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.remarks) {
              fillTextAreaWebComponent('remarks', data.remarks);
            }
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            reviewAndSubmitPageFlow(data.claimantFullName, 'Submit form');
          });
        });
      },
    },
    setupPerTest: () => {
      // Mock API endpoints
      cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);

      // Mock the form submission endpoint
      cy.intercept('POST', formConfig.submitUrl, req => {
        // Mock successful response
        req.reply({ status: 200 });
      });

      // Mock save in progress endpoints
      cy.intercept('GET', '/v0/in_progress_forms/21P-601', mockSipGet);
      cy.intercept('PUT', '/v0/in_progress_forms/21P-601', mockSipPut);

      // Include shadow DOM in commands
      cy.config('includeShadowDom', true);
      cy.config('retries', { runMode: 0 });

      cy.login(mockUser);
    },
    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
