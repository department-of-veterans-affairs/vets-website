import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from '../fixtures/mocks/feature-toggles.json';
import user from '../fixtures/mocks/user.json';
import mockSubmit from '../fixtures/mocks/application-submit.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import { reviewAndSubmitPageFlow } from '../../../shared/tests/e2e/helpers';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['minimal-test', 'maximal-test'],
    dataDir: path.join(__dirname, '..', 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/^start/i, { selector: 'a[href="#start"]' })
            .last()
            .click({ force: true });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { fullName } = data;

            reviewAndSubmitPageFlow(fullName, 'Submit application');
          });
        });
      },
      // Example page hook
      // All paths are already automatically filled out based on fixtures.
      // But if you want to manually test a page add the path.
      // 'name-and-date-of-birth': ({ afterHook }) => {
      //   cy.injectAxeThenAxeCheck();
      //   afterHook(() => {
      //     cy.get('@testData').then(() => {
      //       cy.fillPage(); // fills all fields based on fixtures.
      //       cy.axeCheck();
      //       cy.findByText(/continue/i, { selector: 'button' }).click();
      //     });
      //   });
      // },
      'employers/:index/employment-dates': ({ afterHook, index }) => {
        afterHook(() => {
          cy.get('@testData').then(formData => {
            const employmentDates =
              formData?.employers?.[index]?.employmentDates;

            if (employmentDates?.from) {
              cy.fillVaMemorableDate(
                'root_employmentDates_from',
                employmentDates.from,
              );
            }

            if (employmentDates?.to) {
              cy.fillVaMemorableDate(
                'root_employmentDates_to',
                employmentDates.to,
              );
            }

            cy.clickFormContinue();
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/user', user);
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
      cy.login(user);
    },
    // skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
