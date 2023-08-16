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

/**
 * Returns /path/0 for example instead of /path/:index
 * @param {string} pagePath
 * @param {number | string} index
 */
const replaceArrayIndexPath = (pagePath, index = 0) => {
  return pagePath.replace(/:index/, index);
};

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
              'wcV3CheckSimpleText',
              data.wcV3CheckSimpleText,
            );

            selectCheckboxWebComponent(
              'wcV3CheckRequiredCheckbox',
              data.wcV3CheckRequiredCheckbox,
            );

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
              'wcv3VaCompensationType',
              data.wcv3VaCompensationType,
            );
            selectRadioWebComponent(
              'wcv3VaTileCompensationType',
              data.wcv3VaTileCompensationType,
            );
            selectYesNoWebComponent(
              'wcv3IsCurrentlyActiveDuty',
              data.wcv3IsCurrentlyActiveDuty,
            );

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.radioRelationshipToVeteran]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            // web components
            selectRadioWebComponent(
              'wcv3RelationshipToVeteran_relationshipToVeteran',
              data.wcv3RelationshipToVeteran.relationshipToVeteran,
            );

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.arraySinglePage]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            // array example 1
            fillTextWebComponent(
              'exampleArrayOne_0_facilityName',
              data.exampleArrayOne[0].facilityName,
            );
            fillDateWebComponentPattern(
              'exampleArrayOne_0_from',
              data.exampleArrayOne[0].from,
            );
            fillDateWebComponentPattern(
              'exampleArrayData_0_to',
              data.exampleArrayData[0].to,
            );
            cy.findByText(/add another facility/i, {
              selector: 'button',
            }).click();
            fillTextWebComponent(
              'exampleArrayOne_1_facilityName',
              data.exampleArrayOne[1].facilityName,
            );
            fillDateWebComponentPattern(
              'exampleArrayOne_1_from',
              data.exampleArrayOne[1].from,
            );
            fillDateWebComponentPattern(
              'exampleArrayData_1_to',
              data.exampleArrayData[1].to,
            );

            // array example 2
            fillTextWebComponent(
              'exampleArrayTwo_0_name',
              data.exampleArrayTwo[0].name,
            );
            selectYesNoWebComponent(
              'exampleArrayTwo_0_proof',
              data.exampleArrayTwo[0].proof,
            );

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.arrayMultiplePage]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            // array example 1
            fillFullNameWebComponentPattern(
              'exampleArrayData_0_fullName',
              data.exampleArrayData[0].fullName,
            );

            cy.findByText(/add another child/i, {
              selector: 'button',
            }).click();

            fillFullNameWebComponentPattern(
              'exampleArrayData_1_fullName',
              data.exampleArrayData[1].fullName,
            );

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [replaceArrayIndexPath(pagePaths.arrayMultiplePageItem, 0)]: ({
        afterHook,
      }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressWebComponentPattern(
              'address',
              data.exampleArrayData[0].address,
            );

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [replaceArrayIndexPath(pagePaths.arrayMultiplePageItem, 1)]: ({
        afterHook,
      }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressWebComponentPattern(
              'address',
              data.exampleArrayData[1].address,
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
