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
} from '../../../shared/tests/e2e/helpers';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
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
            cy.fillAddressWebComponentPattern(
              'veteran_address',
              data.veteran.address,
            );
            cy.findByText(/continue/i, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'patient-identification-1': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectYesNoWebComponent(
              'patientIdentification_isRequestingOwnMedicalRecords',
              data.patientIdentification.isRequestingOwnMedicalRecords,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'records-requested-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const hasTreatmentRecords = data['view:hasTreatmentRecords'];

            selectYesNoWebComponent(
              'view:hasTreatmentRecords',
              hasTreatmentRecords,
            );

            cy.findByText(/continue/i, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'records-requested/0/name-and-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent(
              'providerFacilityName',
              data.providerFacility[0].providerFacilityName,
            );
            cy.fillAddressWebComponentPattern(
              'providerFacilityAddress',
              data.providerFacility[0].providerFacilityAddress,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'records-requested/0/conditions': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextAreaWebComponent(
              'conditionsTreated',
              data.providerFacility[0].conditionsTreated,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'records-requested/0/treatment-dates': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillDateWebComponentPattern(
              'treatmentDateRange_from',
              data.providerFacility[0].treatmentDateRange.from,
            );
            fillDateWebComponentPattern(
              'treatmentDateRange_to',
              data.providerFacility[0].treatmentDateRange.to,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'preparer-address-2': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillAddressWebComponentPattern(
              'preparerIdentification_preparerAddress',
              data.preparerIdentification.preparerAddress,
            );
            cy.findByText(/continue/i, { selector: 'button' })
              .last()
              .click();
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
