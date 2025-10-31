import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';

const continueClick = () => {
  cy.get('va-button')
    .shadow()
    .find('button:contains("Continue")')
    .click();
};

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['minimal-test', 'maximal-test'],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findByTestId('start-nursing-home-info-link').click();
        });
      },
      'nursing-official-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(testData => {
            cy.get('va-text-input[name="firstName"]')
              .shadow()
              .find('input')
              .type(testData.nursingOfficialInformation.firstName);
            cy.get('va-text-input[name="lastName"]')
              .shadow()
              .find('input')
              .type(testData.nursingOfficialInformation.firstName);
            cy.get('va-text-input[name="jobTitle"]')
              .shadow()
              .find('input')
              .type(testData.nursingOfficialInformation.jobTitle);
            cy.get('va-telephone-input[name="phoneNumber"]')
              .shadow()
              .find('input')
              .type(testData.nursingOfficialInformation.phoneNumber);
          });
          continueClick();
        });
      },
      'nursing-home-details': ({ afterHook }) => {
        afterHook(() => {
          continueClick();
        });
      },
      'claimant-question': ({ afterHook }) => {
        afterHook(() => {
          continueClick();
        });
      },
      // Conditional: only for spouse/parent
      'claimant-personal-info': ({ afterHook }) => {
        afterHook(() => {
          continueClick();
        });
      },
      // Conditional: only for spouse/parent
      'claimant-identification-info': ({ afterHook }) => {
        afterHook(() => {
          continueClick();
        });
      },
      'veteran-personal-info': ({ afterHook }) => {
        afterHook(() => {
          continueClick();
        });
      },
      'veteran-identification-info': ({ afterHook }) => {
        afterHook(() => {
          continueClick();
        });
      },
      'certification-level-of-care': ({ afterHook }) => {
        afterHook(() => {
          continueClick();
        });
      },
      'admission-date': ({ afterHook }) => {
        afterHook(() => {
          continueClick();
        });
      },
      'medicaid-facility': ({ afterHook }) => {
        afterHook(() => {
          continueClick();
        });
      },
      'medicaid-application': ({ afterHook }) => {
        afterHook(() => {
          continueClick();
        });
      },
      'medicaid-status': ({ afterHook }) => {
        afterHook(() => {
          continueClick();
        });
      },
      // Conditional: only when currently covered by Medicaid
      'medicaid-start-date': ({ afterHook }) => {
        afterHook(() => {
          continueClick();
        });
      },
      'monthly-costs': ({ afterHook }) => {
        afterHook(() => {
          continueClick();
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('POST', formConfig.submitUrl, { status: 200 });
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
