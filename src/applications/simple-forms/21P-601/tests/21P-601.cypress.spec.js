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
  selectRadioWebComponent,
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

      'your-name-and-date-of-birth': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillFullNameWebComponentPattern(
              'claimantFullName',
              data.claimantFullName,
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

      'your-ssn': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent(
              'claimantIdentification_ssn',
              data.claimantIdentification.ssn,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'your-mailing-address': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillAddressWebComponentPattern(
              'claimantAddress',
              data.claimantAddress,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'your-phone-and-email': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
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
            selectRadioWebComponent(
              'relationshipToDeceased',
              data.relationshipToDeceased,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },

      'waiver-of-substitution': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
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

      // Array builder pages are handled automatically by the form tester

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

      // Expenses array builder pages handled automatically

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

      // Other debts array builder pages handled automatically

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
    // skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
