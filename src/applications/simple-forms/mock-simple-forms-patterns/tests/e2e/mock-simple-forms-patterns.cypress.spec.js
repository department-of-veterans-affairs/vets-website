import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';
import {
  fillAddressWebComponentPattern,
  fillDateWebComponentPattern,
  fillFullNameWebComponentPattern,
  fillTextAreaWebComponent,
  fillTextWebComponent,
  introductionPageFlow,
  selectCheckboxWebComponent,
  selectDropdownWebComponent,
  selectRadioWebComponent,
  selectYesNoWebComponent,
} from '../../../shared/tests/e2e/helpers';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

import pagePaths from './pagePaths';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['minimal-test'],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          introductionPageFlow();
        });
      },
      [pagePaths.textInput]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            // widgets
            cy.fillPage();

            // web components
            fillTextWebComponent('requiredNew', data?.requiredNew);
            fillTextWebComponent('requiredNewV3', data?.requiredNewV3);
            fillTextAreaWebComponent('textAreaNewV3', data?.textAreaNewV3);

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.textInputFullName]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            // widgets
            cy.fillPage();

            // web components
            fillFullNameWebComponentPattern(
              'spouseFullNameNew',
              data.spouseFullNameNew,
            );
            fillFullNameWebComponentPattern(
              'spouseFullNameNewV3',
              data.spouseFullNameNewV3,
            );

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.textInputAddress]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            // widgets
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

            // web components
            fillAddressWebComponentPattern('addressNew', data.addressNew);

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.textInputSsn]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            // widgets
            cy.fillPage();

            // web components
            fillTextWebComponent('ssnNew', data.ssnNew);
            fillTextWebComponent('ssnNewV3', data.ssnNewV3);

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.checkboxAndTextInput]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            // widgets
            cy.fillPage();

            // web components
            fillTextWebComponent('wcSimpleText', data.wcSimpleText);
            selectCheckboxWebComponent(
              'wcRequiredCheckbox',
              data.wcRequiredCheckbox,
            );
            fillTextWebComponent('wcSsn', data.wcSsn);
            fillTextWebComponent('wcV3SimpleText', data.wcV3SimpleText);

            // bug: if can't check checkbox, then click label.
            cy.get(`va-checkbox[name="root_wcV3RequiredCheckbox"]`)
              .shadow()
              .find('label')
              .click();

            fillTextWebComponent('wcV3Ssn', data.wcV3Ssn);

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.select]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            // widgets
            cy.fillPage();

            // web components
            selectDropdownWebComponent('selectWC', data.selectWC);
            selectDropdownWebComponent('selectWC2', data.selectWC2);
            selectDropdownWebComponent('selectWC2V3', data.selectWC2V3);

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.date]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(async () => {
          cy.get('@testData').then(data => {
            // widgets
            cy.fillPage();

            // web components
            fillDateWebComponentPattern('dateWCV3', data.dateWCV3);

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.radio]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            // widgets
            cy.fillPage();

            // web components
            selectRadioWebComponent(
              'wcVaCompensationType',
              data.wcVaCompensationType,
            );
            // use underscores to separate sub-property names
            selectYesNoWebComponent(
              'wcCurrentlyActiveDuty_yes',
              data.wcCurrentlyActiveDuty.yes,
            );
            selectRadioWebComponent(
              'wcVaTileCompensationType',
              data.wcVaTileCompensationType,
            );
            selectRadioWebComponent(
              'wcv3VaCompensationType',
              data.wcv3VaCompensationType,
            );
            selectRadioWebComponent(
              'wcv3VaTileCompensationType',
              data.wcv3VaTileCompensationType,
            );

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(() => {
            cy.findAllByText(/Submit application/i, {
              selector: 'button',
            }).click();
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
    },
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
