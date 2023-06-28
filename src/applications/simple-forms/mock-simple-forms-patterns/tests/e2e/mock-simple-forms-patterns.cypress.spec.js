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
            fillTextWebComponent('wcOldRequired', data?.wcOldRequired);
            fillTextWebComponent('wcv3RequiredNew', data?.wcv3RequiredNew);
            fillTextAreaWebComponent('wcv3TextAreaNew', data?.wcv3TextAreaNew);

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
              'wcOldSpouseFullName',
              data.wcOldSpouseFullName,
            );
            fillFullNameWebComponentPattern(
              'wcv3SpouseFullNameNew',
              data.wcv3SpouseFullNameNew,
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
            fillAddressWebComponentPattern('wcv3Address', data.wcv3Address);

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
            fillTextWebComponent('wcOldSsn', data.wcOldSsn);
            fillTextWebComponent('wcv3SsnNew', data.wcv3SsnNew);

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
            fillTextWebComponent(
              'wcOldCheckSimpleText',
              data.wcOldCheckSimpleText,
            );
            selectCheckboxWebComponent(
              'wcOldCheckRequiredCheckbox',
              data.wcOldCheckRequiredCheckbox,
            );
            fillTextWebComponent('wcOldCheckSsn', data.wcOldCheckSsn);
            fillTextWebComponent(
              'wcV3CheckSimpleText',
              data.wcV3CheckSimpleText,
            );

            // bug: if can't check checkbox, then click label.
            cy.get(`va-checkbox[name="root_wcV3CheckRequiredCheckbox"]`)
              .shadow()
              .find('label')
              .click();

            fillTextWebComponent('wcV3CheckSsn', data.wcV3CheckSsn);

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
            selectDropdownWebComponent(
              'wcOldSelectFirst',
              data.wcOldSelectFirst,
            );
            selectDropdownWebComponent(
              'wcOldSelectSecond',
              data.wcOldSelectSecond,
            );
            selectDropdownWebComponent('wcv3Select', data.wcv3Select);

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
              'wcOldVaCompensationType',
              data.wcOldVaCompensationType,
            );
            // use underscores to separate sub-property names
            selectYesNoWebComponent(
              'wcOldCurrentlyActiveDuty_yes',
              data.wcOldCurrentlyActiveDuty.yes,
            );
            selectRadioWebComponent(
              'wcOldVaTileCompensationType',
              data.wcOldVaTileCompensationType,
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
