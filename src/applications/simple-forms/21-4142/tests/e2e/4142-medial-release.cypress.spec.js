import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import user from './fixtures/mocks/user.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import { fillProviderFacility } from './helpers';
import { reviewAndSubmitPageFlow } from '../../../shared/tests/e2e/helpers';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['minimal-test', 'maximal-test'],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findByText(/start the medical release authorization/i).click({
            force: true,
          });
        });
      },
      'contact-information-1': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillPage();
            // fillPage doesn't catch state select, so select state manually
            cy.get('select#root_veteran_address_state').select(
              data.veteran.address.state,
            );
            if (data.veteran.address.city) {
              if (data.veteran.address.isMilitary) {
                // there is a select dropdown instead when military is checked
                cy.get('select#root_veteran_address_city').select(
                  data.veteran.address.city,
                );
              } else {
                cy.get('#root_veteran_address_city').type(
                  data.veteran.address.city,
                );
              }
            }
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'patient-identification-1': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.get('.form-radio-buttons') // get the radio container
              .find('input[type="radio"]')
              .eq(
                data.patientIdentification.isRequestingOwnMedicalRecords
                  ? 0
                  : 1,
              ) // Select the first (0) for true and the second (1) for false
              .check();
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'records-requested': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            for (
              let facilityIndex = 0;
              facilityIndex < data.providerFacility.length;
              facilityIndex++
            ) {
              fillProviderFacility(data, facilityIndex);
              if (facilityIndex < data.providerFacility.length - 1) {
                cy.findByText(/add another/i, {
                  selector: 'button',
                }).click();
              }
            }
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            let signerName = data.veteran.fullName;
            if (
              data.preparerIdentification?.preparerFullName &&
              Object.keys(data.preparerIdentification?.preparerFullName)
                .length > 0
            ) {
              signerName = data.preparerIdentification?.preparerFullName;
            }
            reviewAndSubmitPageFlow(
              signerName,
              'Submit medical release authorization',
            );
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);

      cy.login(user);
    },
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
