import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import { selectDropdownWebComponent } from './helpers';
import formConfig from '../config/form';
import manifest from '../manifest.json';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['test-data'],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText('Start your application without signing in')
            .last()
            .click();
        });
      },
      'place-of-birth': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillPage();
            selectDropdownWebComponent(
              'placeOfBirthAddress_state',
              data.placeOfBirthAddress.state,
            );
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'home-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillPage();
            selectDropdownWebComponent(
              'homeAddress_state',
              data.homeAddress.state,
            );
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'work-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillPage();
            selectDropdownWebComponent(
              'workAddress_state',
              data.workAddress.state,
            );
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'other-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillPage();
            selectDropdownWebComponent(
              'otherAddress_state',
              data.otherAddress.state,
            );
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: '21a',
              value: true,
            },
          ],
        },
      });
      cy.intercept('POST', formConfig.submitUrl);
    },

    // Remove this skip when the form has a content page in prod
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
