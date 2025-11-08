import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config/form';
import manifest from '@bio-aquia/21-2680-house-bound-status/manifest.json';
import {
  clickContinue,
  fillTextInput,
  fillMemorableDate,
  fillAddress,
  selectRadioByValue,
} from '@bio-aquia/shared/tests/cypress-helpers';
import mockUser from './fixtures/mocks/user.json';

/**
 * Helper function to fill FullnameField component
 * @param {string} prefix - Field name prefix (e.g., 'veteranFullName')
 * @param {Object} name - Name object with first, middle, last, suffix
 */
const fillFullName = (prefix, name) => {
  if (!name) return;
  if (name.first) {
    fillTextInput(`${prefix}.first`, name.first);
  }
  if (name.middle) {
    fillTextInput(`${prefix}.middle`, name.middle);
  }
  if (name.last) {
    fillTextInput(`${prefix}.last`, name.last);
  }
  if (name.suffix) {
    cy.get(`select[name="${prefix}.suffix"]`).select(name.suffix);
  }
};

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir:
      'applications/benefits-optimization-aquia/21-2680-house-bound-status/tests/fixtures/data',
    dataSets: ['minimal-test', 'maximal-test'],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          // Wait for the start button to be visible and ready
          // SaveInProgressIntro component generates a link with href="#start"
          cy.get('a[href="#start"]')
            .should('be.visible')
            .click();
        });
      },
      'veteran-identity': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const vetInfo = data.veteranIdentification;
            fillFullName('veteranFullName', vetInfo?.veteranFullName);
            fillTextInput('veteranSSN', vetInfo?.veteranSSN);
            fillMemorableDate('veteranDOB', vetInfo?.veteranDOB);
          });
          clickContinue();
        });
      },
      'veteran-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const vetAddr = data.veteranAddress;
            fillAddress('veteranAddress', vetAddr?.veteranAddress);
          });
          clickContinue();
        });
      },
      'claimant-relationship': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { claimantRelationship } = data;
            if (claimantRelationship?.claimantRelationship) {
              selectRadioByValue(claimantRelationship.claimantRelationship);
            }
          });
          clickContinue();
        });
      },
      'claimant-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const claimantInfo = data.claimantInformation;
            fillFullName('claimantFullName', claimantInfo?.claimantFullName);
            fillMemorableDate('claimantDOB', claimantInfo?.claimantDOB);
          });
          clickContinue();
        });
      },
      'claimant-ssn': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { claimantSSN } = data;
            fillTextInput('claimantSSN', claimantSSN?.claimantSSN);
          });
          clickContinue();
        });
      },
      'claimant-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const claimantAddr = data.claimantAddress;
            fillAddress('claimantAddress', claimantAddr?.claimantAddress);
          });
          clickContinue();
        });
      },
      'claimant-contact': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const contact = data.claimantContact;
            fillTextInput('claimantPhoneNumber', contact?.claimantPhoneNumber);
            fillTextInput('claimantMobilePhone', contact?.claimantMobilePhone);
            fillTextInput('claimantEmail', contact?.claimantEmail);
          });
          clickContinue();
        });
      },
      'benefit-type': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { benefitType } = data;
            if (benefitType?.benefitType) {
              selectRadioByValue(benefitType.benefitType);
            }
          });
          clickContinue();
        });
      },
      'hospitalization-status': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const hospStatus = data.hospitalizationStatus;
            if (hospStatus?.isCurrentlyHospitalized) {
              selectRadioByValue(hospStatus.isCurrentlyHospitalized);
            }
          });
          clickContinue();
        });
      },
      'hospitalization-date': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const hospDate = data.hospitalizationDate;
            fillMemorableDate('admissionDate', hospDate?.admissionDate);
          });
          clickContinue();
        });
      },
      'hospitalization-facility': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const facility = data.hospitalizationFacility;
            fillTextInput('facilityName', facility?.facilityName);
            fillAddress('facilityAddress', facility?.facilityAddress);
          });
          clickContinue();
        });
      },
    },

    setupPerTest: () => {
      cy.login(mockUser);
      cy.intercept('GET', '/v0/user', mockUser);
      cy.intercept('GET', '/v0/feature_toggles*', {
        statusCode: 200,
        body: {
          data: {
            features: [],
          },
        },
      });
      cy.intercept('GET', '/v0/in_progress_forms/21-2680', {
        statusCode: 200,
        body: {
          data: {
            id: '',
            type: 'in_progress_forms',
            attributes: {
              formId: '21-2680',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              metadata: {},
            },
          },
        },
      });
      cy.intercept('PUT', '/v0/in_progress_forms/21-2680', {
        statusCode: 200,
        body: {
          data: {
            id: '',
            type: 'in_progress_forms',
            attributes: {
              formId: '21-2680',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              metadata: {},
            },
          },
        },
      });
      cy.intercept('POST', formConfig.submitUrl, {
        statusCode: 200,
        body: {
          data: {
            attributes: {
              confirmationNumber: '123456789',
            },
          },
        },
      });
    },

    // Skip tests until authentication issues are resolved.
    // Remove this setting when ready to run tests.
    skip: true,
  },
  manifest,
  formConfig,
);

// Add stability between tests
beforeEach(() => {
  // Clear any lingering state between tests
  cy.clearCookies();
  cy.clearLocalStorage();
});

testForm(testConfig);

// Configure retries for the test suite to handle transient network errors
if (Cypress.config('isInteractive')) {
  // No retries in interactive mode
  Cypress.config('retries', 0);
} else {
  // Retry up to 2 times in run mode
  Cypress.config('retries', { runMode: 2, openMode: 0 });
}
