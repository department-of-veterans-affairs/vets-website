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
            cy.fillPage();
            let dataName = 'requiredNew';
            cy.get(`va-text-input[name="root_${dataName}"]`)
              .shadow()
              .find('input')
              .type(data?.[dataName]);

            dataName = 'requiredNewV3';
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

            cy.get(`va-text-input[name="root_spouseFullNameNewV3_first"]`)
              .shadow()
              .find('input')
              .type(data.spouseFullNameNew.first);

            cy.get(`va-text-input[name="root_spouseFullNameNewV3_last"]`)
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

            cy.get(`va-text-input[name="root_ssnNew"]`)
              .shadow()
              .find('input')
              .type(data.ssnNew);

            cy.get(`va-text-input[name="root_ssnNewV3"]`)
              .shadow()
              .find('input')
              .type(data.ssnNewV3);

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

            cy.get(`va-text-input[name="root_wcSimpleText"]`)
              .shadow()
              .find('input')
              .type(data.wcSimpleText);

            cy.get(`va-checkbox[name="root_wcRequiredCheckbox"]`)
              .shadow()
              .find('input')
              .check();

            cy.get(`va-text-input[name="root_wcSsn"]`)
              .shadow()
              .find('input')
              .type(data.wcSsn);

            cy.get(`va-text-input[name="root_wcV3SimpleText"]`)
              .shadow()
              .find('input')
              .type(data.wcV3SimpleText);

            // if can't check checkbox, then click label.
            cy.get(`va-checkbox[name="root_wcV3RequiredCheckbox"]`)
              .shadow()
              .find('label')
              .click();

            cy.get(`va-text-input[name="root_wcV3Ssn"]`)
              .shadow()
              .find('input')
              .type(data.wcV3Ssn);

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      select: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillPage();

            cy.get(`va-select[name="root_selectWC"]`)
              .shadow()
              .find('select')
              .select(data.selectWC);

            cy.get(`va-select[name="root_selectWC2"]`)
              .shadow()
              .find('select')
              .select(data.selectWC2);

            cy.get(`va-select[name="root_selectWC2V3"]`)
              .shadow()
              .find('select')
              .select(data.selectWC2V3);

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      date: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(async () => {
          cy.get('@testData').then(data => {
            cy.fillPage();

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
              .find('va-text-input.input-month')
              .shadow()
              .find('input')
              .type(month)
              .then(() => {
                cy.get(`va-memorable-date[name="root_dateWCV3"]`)
                  .shadow()
                  .find('va-text-input.input-day')
                  .shadow()
                  .find('input')
                  .type(day)
                  .then(() => {
                    cy.get(`va-memorable-date[name="root_dateWCV3"]`)
                      .shadow()
                      .find('va-text-input.input-year')
                      .shadow()
                      .find('input')
                      .type(year);
                  });
              });

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      radio: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillPage();

            cy.get(
              `va-radio-option[name="root_wcVaCompensationType"][value="${
                data.wcVaCompensationType
              }"]`,
            ).click();

            cy.get(
              `va-radio-option[name="root_wcVaTileCompensationType"][value="${
                data.wcVaTileCompensationType
              }"]`,
            ).click();

            cy.get(
              `va-radio-option[name="root_wcv3VaCompensationType"][value="${
                data.wcv3VaCompensationType
              }"]`,
            ).click();

            cy.get(
              `va-radio-option[name="root_wcv3VaTileCompensationType"][value="${
                data.wcv3VaTileCompensationType
              }"]`,
            ).click();

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
