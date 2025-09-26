import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import user from './fixtures/mocks/user.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import {
  fillDateWebComponentPattern,
  fillTextAreaWebComponent,
  fillTextWebComponent,
  reviewAndSubmitPageFlow,
  selectYesNoWebComponent,
  selectCheckboxWebComponent,
  selectDropdownWebComponent,
} from '../../../shared/tests/e2e/helpers';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: [
      'minimal-test',
      'test-data-spouse',
      'test-data-child',
      'test-data-parent',
      'test-data-executor',
      'test-data-creditor',
      'test-beneficiary-not-veteran',
    ],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findByText(/start the application/i).click({
            force: true,
          });
        });
      },
      'already-filed': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectYesNoWebComponent('hasAlreadyFiled', data.hasAlreadyFiled);
            cy.findByText(/continue/i, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'witness-signature': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectYesNoWebComponent(
              'needsWitnessSignature',
              data.needsWitnessSignature,
            );
            cy.findByText(/continue/i, { selector: 'button' })
              .last()
              .click();
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
            cy.findByText(/continue/i, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'veteran-name': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent(
              'veteranFullName_first',
              data.veteranFullName.first,
            );
            fillTextWebComponent(
              'veteranFullName_middle',
              data.veteranFullName.middle,
            );
            fillTextWebComponent(
              'veteranFullName_last',
              data.veteranFullName.last,
            );
            cy.findByText(/continue/i, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'veteran-identifiers': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent('veteranSsn', data.veteranSsn);
            if (data.veteranVaFileNumber) {
              fillTextWebComponent(
                'veteranVaFileNumber',
                data.veteranVaFileNumber,
              );
            }
            cy.findByText(/continue/i, { selector: 'button' })
              .last()
              .click();
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
            cy.findByText(/continue/i, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'beneficiary-name': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.beneficiaryFullName) {
              fillTextWebComponent(
                'beneficiaryFullName_first',
                data.beneficiaryFullName.first,
              );
              fillTextWebComponent(
                'beneficiaryFullName_middle',
                data.beneficiaryFullName.middle,
              );
              fillTextWebComponent(
                'beneficiaryFullName_last',
                data.beneficiaryFullName.last,
              );
            }
            cy.findByText(/continue/i, { selector: 'button' })
              .last()
              .click();
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
            cy.findByText(/continue/i, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'your-personal-information': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent(
              'claimantFullName_first',
              data.claimantFullName.first,
            );
            fillTextWebComponent(
              'claimantFullName_middle',
              data.claimantFullName.middle,
            );
            fillTextWebComponent(
              'claimantFullName_last',
              data.claimantFullName.last,
            );
            fillTextWebComponent('claimantSsn', data.claimantSsn);
            fillDateWebComponentPattern(
              'claimantDateOfBirth',
              data.claimantDateOfBirth,
            );
            cy.findByText(/continue/i, { selector: 'button' })
              .last()
              .click();
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
            fillTextWebComponent('claimantPhone', data.claimantPhone);
            fillTextWebComponent('claimantEmail', data.claimantEmail);
            cy.findByText(/continue/i, { selector: 'button' })
              .last()
              .click();
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
            cy.findByText(/continue/i, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'surviving-relatives': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.hasSpouse) {
              selectCheckboxWebComponent('hasSpouse', true);
            }
            if (data.hasChildren) {
              selectCheckboxWebComponent('hasChildren', true);
            }
            if (data.hasParents) {
              selectCheckboxWebComponent('hasParents', true);
            }
            if (data.hasNone) {
              selectCheckboxWebComponent('hasNone', true);
            }
            cy.findByText(/continue/i, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'relatives-information': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            // Handle dynamic array of relatives
            if (data.survivingRelatives && data.survivingRelatives.length > 0) {
              data.survivingRelatives.forEach((relative, index) => {
                if (index > 0) {
                  cy.findByText(/add another/i).click();
                }
                fillTextWebComponent(
                  `survivingRelatives_${index}_fullName_first`,
                  relative.fullName.first,
                );
                fillTextWebComponent(
                  `survivingRelatives_${index}_fullName_middle`,
                  relative.fullName.middle,
                );
                fillTextWebComponent(
                  `survivingRelatives_${index}_fullName_last`,
                  relative.fullName.last,
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
            cy.findByText(/continue/i, { selector: 'button' })
              .last()
              .click();
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
            cy.findByText(/continue/i, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'review-and-submit': () => {
        reviewAndSubmitPageFlow();
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?', featureToggles);
      cy.intercept('GET', '/v0/user', user);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
      cy.login(user);
    },
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(testConfig);

// Additional tests for ineligible scenarios
describe('21P-601 Ineligible Scenarios', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles?', featureToggles);
    cy.intercept('GET', '/v0/user', user);
    cy.intercept('POST', formConfig.submitUrl, mockSubmit);
    cy.login(user);
  });

  it('should stop at eligibility summary when already filed', () => {
    cy.visit('/pension/accrued-benefits/application-21p-601/introduction');
    cy.injectAxeThenAxeCheck();
    cy.findByText(/start the application/i).click();

    // Select "Yes" to already filed
    selectYesNoWebComponent('hasAlreadyFiled', true);
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Should see eligibility summary
    cy.findByText(/You can't submit this form online/i).should('exist');
    cy.findByText(/already filed for survivor benefits/i).should('exist');
    cy.injectAxeThenAxeCheck();
  });

  it('should stop at eligibility summary when cannot sign', () => {
    cy.visit('/pension/accrued-benefits/application-21p-601/introduction');
    cy.injectAxeThenAxeCheck();
    cy.findByText(/start the application/i).click();

    // Select "No" to already filed
    selectYesNoWebComponent('hasAlreadyFiled', false);
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Select "No" to can sign (needs witness)
    selectYesNoWebComponent('needsWitnessSignature', false);
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Should see eligibility summary
    cy.findByText(/You can't submit this form online/i).should('exist');
    cy.findByText(/need witness signatures/i).should('exist');
    cy.injectAxeThenAxeCheck();
  });

  it('should stop at eligibility summary when has unpaid creditors', () => {
    cy.visit('/pension/accrued-benefits/application-21p-601/introduction');
    cy.injectAxeThenAxeCheck();
    cy.findByText(/start the application/i).click();

    // Select "No" to already filed
    selectYesNoWebComponent('hasAlreadyFiled', false);
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Select "Yes" to can sign
    selectYesNoWebComponent('needsWitnessSignature', true);
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Select "Yes" to unpaid creditors
    selectYesNoWebComponent('hasUnpaidCreditors', true);
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Should see eligibility summary
    cy.findByText(/You can't submit this form online/i).should('exist');
    cy.findByText(/have unpaid creditors/i).should('exist');
    cy.injectAxeThenAxeCheck();
  });

  it('should show beneficiary name fields only when beneficiary is not the veteran', () => {
    cy.visit('/pension/accrued-benefits/application-21p-601/introduction');
    cy.injectAxeThenAxeCheck();
    cy.findByText(/start the application/i).click();

    // Pass eligibility
    selectYesNoWebComponent('hasAlreadyFiled', false);
    cy.findByText(/continue/i, { selector: 'button' }).click();
    selectYesNoWebComponent('needsWitnessSignature', true);
    cy.findByText(/continue/i, { selector: 'button' }).click();
    selectYesNoWebComponent('hasUnpaidCreditors', false);
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Fill veteran info
    fillTextWebComponent('veteranFullName_first', 'John');
    fillTextWebComponent('veteranFullName_last', 'Doe');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    fillTextWebComponent('veteranSsn', '123456789');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Select beneficiary is NOT veteran
    selectYesNoWebComponent('beneficiaryIsVeteran', false);
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Should see beneficiary name page
    cy.url().should('include', 'beneficiary-name');
    cy.findByLabelText(/first name/i).should('exist');
    cy.injectAxeThenAxeCheck();
  });

  it('should skip beneficiary name when beneficiary is the veteran', () => {
    cy.visit('/pension/accrued-benefits/application-21p-601/introduction');
    cy.injectAxeThenAxeCheck();
    cy.findByText(/start the application/i).click();

    // Pass eligibility
    selectYesNoWebComponent('hasAlreadyFiled', false);
    cy.findByText(/continue/i, { selector: 'button' }).click();
    selectYesNoWebComponent('needsWitnessSignature', true);
    cy.findByText(/continue/i, { selector: 'button' }).click();
    selectYesNoWebComponent('hasUnpaidCreditors', false);
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Fill veteran info
    fillTextWebComponent('veteranFullName_first', 'John');
    fillTextWebComponent('veteranFullName_last', 'Doe');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    fillTextWebComponent('veteranSsn', '123456789');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Select beneficiary IS veteran
    selectYesNoWebComponent('beneficiaryIsVeteran', true);
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Should skip to date of death
    cy.url().should('include', 'beneficiary-date-of-death');
    cy.injectAxeThenAxeCheck();
  });

  it('should show expenses chapter for executor', () => {
    cy.visit('/pension/accrued-benefits/application-21p-601/introduction');
    cy.injectAxeThenAxeCheck();
    cy.findByText(/start the application/i).click();

    // Pass eligibility
    selectYesNoWebComponent('hasAlreadyFiled', false);
    cy.findByText(/continue/i, { selector: 'button' }).click();
    selectYesNoWebComponent('needsWitnessSignature', true);
    cy.findByText(/continue/i, { selector: 'button' }).click();
    selectYesNoWebComponent('hasUnpaidCreditors', false);
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Fill veteran info
    fillTextWebComponent('veteranFullName_first', 'John');
    fillTextWebComponent('veteranFullName_last', 'Doe');
    cy.findByText(/continue/i, { selector: 'button' }).click();
    fillTextWebComponent('veteranSsn', '123456789');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Beneficiary info
    selectYesNoWebComponent('beneficiaryIsVeteran', true);
    cy.findByText(/continue/i, { selector: 'button' }).click();
    fillDateWebComponentPattern('beneficiaryDateOfDeath', '2024-01-15');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Fill claimant info
    fillTextWebComponent('claimantFullName_first', 'Jane');
    fillTextWebComponent('claimantFullName_last', 'Smith');
    fillTextWebComponent('claimantSsn', '987654321');
    fillDateWebComponentPattern('claimantDateOfBirth', '1980-05-10');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Fill contact info
    cy.fillAddressWebComponentPattern('claimantAddress', {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      postalCode: '12345',
    });
    fillTextWebComponent('claimantPhone', '555-123-4567');
    fillTextWebComponent('claimantEmail', 'jane@example.com');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Select executor relationship
    selectDropdownWebComponent('relationshipToDeceased', 'executor');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Should navigate to expenses/reimbursement pages
    cy.url().should('include', 'expenses');
    cy.injectAxeThenAxeCheck();
  });

  it('should show expenses chapter when no relatives survive', () => {
    cy.visit('/pension/accrued-benefits/application-21p-601/introduction');
    cy.injectAxeThenAxeCheck();
    cy.findByText(/start the application/i).click();

    // Pass eligibility
    selectYesNoWebComponent('hasAlreadyFiled', false);
    cy.findByText(/continue/i, { selector: 'button' }).click();
    selectYesNoWebComponent('needsWitnessSignature', true);
    cy.findByText(/continue/i, { selector: 'button' }).click();
    selectYesNoWebComponent('hasUnpaidCreditors', false);
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Fill veteran info
    fillTextWebComponent('veteranFullName_first', 'John');
    fillTextWebComponent('veteranFullName_last', 'Doe');
    cy.findByText(/continue/i, { selector: 'button' }).click();
    fillTextWebComponent('veteranSsn', '123456789');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Beneficiary info
    selectYesNoWebComponent('beneficiaryIsVeteran', true);
    cy.findByText(/continue/i, { selector: 'button' }).click();
    fillDateWebComponentPattern('beneficiaryDateOfDeath', '2024-01-15');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Fill claimant info
    fillTextWebComponent('claimantFullName_first', 'Jane');
    fillTextWebComponent('claimantFullName_last', 'Smith');
    fillTextWebComponent('claimantSsn', '987654321');
    fillDateWebComponentPattern('claimantDateOfBirth', '1980-05-10');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Fill contact info
    cy.fillAddressWebComponentPattern('claimantAddress', {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      postalCode: '12345',
    });
    fillTextWebComponent('claimantPhone', '555-123-4567');
    fillTextWebComponent('claimantEmail', 'jane@example.com');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Select spouse relationship (not executor)
    selectDropdownWebComponent('relationshipToDeceased', 'spouse');
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Select no surviving relatives
    selectCheckboxWebComponent('hasNone', true);
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Should navigate to expenses pages
    cy.url().should('include', 'expenses');
    cy.injectAxeThenAxeCheck();
  });
});
