import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from './fixtures/mocks/feature-toggles.json';
import mockSubmit from './fixtures/mocks/application-submit.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['minimal-test'],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.visit('/mock-simple-forms-patterns/date');
        });
      },
      date: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(async () => {
          cy.get('@testData').then(data => {
            // unstable tests
            let [year, month, day] = data.dateWC.split('-');
            cy.get(`va-memorable-date[name="root_dateWC"]`)
              .shadow()
              .find('va-text-input.input-month')
              .shadow()
              .find('input')
              .type(month)
              .then(() => {
                cy.get(`va-memorable-date[name="root_dateWC"]`)
                  .shadow()
                  .find('va-text-input.input-day')
                  .shadow()
                  .find('input')
                  .type(day)
                  .then(() => {
                    cy.get(`va-memorable-date[name="root_dateWC"]`)
                      .shadow()
                      .find('va-text-input.input-year')
                      .shadow()
                      .find('input')
                      .type(year);
                  });
              });

            [year, month, day] = data.dateWCV3.split('-');
            cy.get(`va-memorable-date[name="root_dateWCV3"]`)
              .shadow()
              .find('va-text-input.usa-form-group--month-input')
              .shadow()
              .find('input')
              .type(month)
              .then(() => {
                cy.get(`va-memorable-date[name="root_dateWCV3"]`)
                  .shadow()
                  .find('va-text-input.usa-form-group--day-input')
                  .shadow()
                  .find('input')
                  .type(day)
                  .then(() => {
                    cy.get(`va-memorable-date[name="root_dateWCV3"]`)
                      .shadow()
                      .find('va-text-input.usa-form-group--year-input')
                      .shadow()
                      .find('input')
                      .type(year);
                  });
              });

            cy.axeCheck();
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('POST', '/forms_api/v1/simple_forms', mockSubmit);
    },
    // TODO: memorable date web component has a bug where it sometimes
    // can't select the next field
    skip: true,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
