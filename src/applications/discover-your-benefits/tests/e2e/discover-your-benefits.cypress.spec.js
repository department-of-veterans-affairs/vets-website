import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const goToNextPage = () => {
  cy.findAllByText(/Continue/i, { selector: 'button' }).click();
};

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['test-data'],
    setupPerTest: () => {},
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('[data-testid="get-started"]').click();
        });
      },
      goals: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const fieldName = 'checkboxGroupGoals_setACareerPath';
            const fieldData = data[fieldName];
            if (fieldData) {
              cy.get(`input[name="root_goals_${fieldData}"]`).check();
            }
            cy.injectAxeThenAxeCheck();
            goToNextPage();
          });
        });
      },
      'service/time-served': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const fieldName = 'militaryServiceTotalTimeServed';
            const fieldData = data[fieldName];
            cy.get(
              `input[name="root_${fieldName}"][value="${fieldData}"]`,
            ).click();
            cy.injectAxeThenAxeCheck();
            goToNextPage();
          });
        });
      },
      'service/current': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const fieldName = 'militaryServiceCurrentlyServing';
            const fieldData = data[fieldName];
            cy.get(
              `input[name="root_${fieldName}"][value="${fieldData}"]`,
            ).click();
            cy.injectAxeThenAxeCheck();
            goToNextPage();
          });
        });
      },
      separation: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const fieldName = 'separation';
            const fieldData = data[fieldName];
            cy.get(
              `input[name="root_${fieldName}"][value="${fieldData}"]`,
            ).click();
            cy.injectAxeThenAxeCheck();
            goToNextPage();
          });
        });
      },
      discharge: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const fieldName = 'characterOfDischarge';
            const fieldData = data[fieldName];
            cy.get(`select[name="root_${fieldName}"]`).select(fieldData);
            cy.injectAxeThenAxeCheck();
            goToNextPage();
          });
        });
      },
      disability: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const fieldName = 'disabilityRating';
            const fieldData = data[fieldName];
            cy.get(
              `input[name="root_${fieldName}"][value="${fieldData}"]`,
            ).click();
            cy.injectAxeThenAxeCheck();
            goToNextPage();
          });
        });
      },
      'review-and-submit': () => {
        cy.get("va-privacy-agreement[name='privacyAgreementAccepted']")
          .find('#checkbox')
          .then($el => cy.selectVaCheckbox($el, true));
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
