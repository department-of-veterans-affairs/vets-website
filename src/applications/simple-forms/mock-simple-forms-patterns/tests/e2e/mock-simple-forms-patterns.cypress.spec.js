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
          cy.findByText(/start/i, { selector: 'button' });
          cy.findByText(/without signing in/i).click({ force: true });
        });
      },
      'text-input': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            const dataName = 'requiredNew';
            cy.fillPage();
            cy.get(`va-text-input[name="root_${dataName}"]`)
              .shadow()
              .find('input')
              .type(data?.[dataName]);

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'text-input-full-name': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillPage();

            cy.get(`va-text-input[name="root_spouseFullNameNew_first"]`)
              .shadow()
              .find('input')
              .type(data.spouseFullNameNew.first);

            cy.get(`va-text-input[name="root_spouseFullNameNew_last"]`)
              .shadow()
              .find('input')
              .type(data.spouseFullNameNew.last);

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'text-input-address': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillPage();
            // fillPage doesn't catch state select, so select state manually
            cy.get('select#root_addressOld_state').select(
              data.addressOld.state,
            );
            if (data.addressOld.city) {
              if (data.addressOld.isMilitary) {
                // there is a select dropdown instead when military is checked
                cy.get('select#root_addressOld_city').select(
                  data.addressOld.city,
                );
              } else {
                cy.get('#root_addressOld_city').type(data.addressOld.city);
              }
            }
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'ssn-pattern': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillPage();

            cy.get(`va-text-input[name="root_ssn"]`)
              .shadow()
              .find('input')
              .type(data.ssn);

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'checkbox-and-text-input': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillPage();

            cy.get(`va-text-input[name="root_textInputNew"]`)
              .shadow()
              .find('input')
              .type(data.textInputNew);

            cy.get(`va-text-input[name="root_textInput"]`)
              .shadow()
              .find('input')
              .type(data.textInput);

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('POST', '/forms_api/v1/simple_forms', mockSubmit);
    },
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
