/* disabling old test, soon to be removed
import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../config/form';
import manifest from '../manifest.json';

import happyPath from './data/users/gregUserData.json';
import noTempAddress from './data/users/markUserData.json';
import noBatteries from './data/users/jerryUserData.json';
import noAccessories from './data/users/eddieUserData.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'testData',

    dataSets: ['happyPath', 'noTempAddress', 'noBatteries', 'noAccessories'],

    fixtures: {
      data: path.join(__dirname, 'data'),
      users: path.join(__dirname, 'data/users'),
    },

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('.vads-c-action-link--green')
            .first()
            .click();
        });
      },
      address: () => {
        cy.get('@testKey').then(testKey => {
          if (testKey === 'noTempAddress') {
            cy.findByText('Add a temporary address', {
              selector: 'button',
            }).click({ force: true });
            cy.findByLabelText(/Country/i).select('Canada');
            cy.findAllByLabelText(/Street address/i)
              .first()
              .type('205 Test Lane');
            cy.findByLabelText(/City/i).type('Calgary');
            cy.findByLabelText(/Province/i).type('Alberta');
            cy.findByLabelText(/International Postal Code/i).type('T7N');
            cy.findByText(/Save temporary address/i).click();
          } else {
            cy.findByText('Edit permanent address', {
              selector: 'button',
            }).click({ force: true });
            cy.findByLabelText(/Country/i).select('Canada');
            cy.findByLabelText(/Province/i).type('Alberta');
            cy.findByLabelText(/International Postal Code/i).type('T7N');
            cy.findByText(/Save permanent address/i).click();
          }
        });
      },
      supplies: () => {
        cy.get('@testKey').then(testKey => {
          if (testKey === 'noBatteries') {
            // #1 is "Order batteries for this device"
            // #3 & #5 are "order this accessory" for the available accessories
            cy.get('#3').click({ force: true });
            cy.get('#5').click({ force: true });
          } else if (testKey === 'noAccessories') {
            cy.get('#1').click({ force: true });
          } else {
            cy.get('#1').click({ force: true });
            cy.get('#3').click({ force: true });
            cy.get('#5').click({ force: true });
          }
        });
      },
    },

    setupPerTest: () => {
      let postData = [];
      cy.get('@testKey').then(testKey => {
        cy.login(testKey);
        if (testKey === 'noBatteries') {
          cy.intercept('GET', '/v0/user', noBatteries);
          postData = [
            {
              status: 'Order Processed',
              orderId: 2324,
              productId: 3,
            },
            {
              status: 'Order Processed',
              orderId: 2325,
              productId: 5,
            },
          ];
        } else if (testKey === 'noAccessories') {
          cy.intercept('GET', '/v0/user', noAccessories);
          postData = [
            {
              status: 'Order Processed',
              orderId: 2326,
              productId: 1,
            },
          ];
        } else if (testKey === 'noTempAddress') {
          cy.intercept('GET', '/v0/user', noTempAddress);
          postData = [
            {
              status: 'Order Processed',
              orderId: 2329,
              productId: 1,
            },
            {
              status: 'Order Processed',
              orderId: 2330,
              productId: 3,
            },
            {
              status: 'Order Processed',
              orderId: 2331,
              productId: 5,
            },
          ];
        } else {
          cy.intercept('GET', '/v0/user', happyPath);
          postData = [
            {
              status: 'Order Processed',
              orderId: 2329,
              productId: 1,
            },
            {
              status: 'Order Processed',
              orderId: 2330,
              productId: 3,
            },
            {
              status: 'Order Processed',
              orderId: 2331,
              productId: 5,
            },
          ];
        }
      });
      cy.get('@testData').then(testData => {
        cy.intercept('GET', '/v0/in_progress_forms/MDOT', testData);
      });
      cy.get('@testKey').then(() => {
        cy.intercept('POST', '/v0/mdot/supplies', postData);
      });
      cy.intercept('GET', '/v0/feature_toggles?*', {
        data: {
          features: [
            { name: 'supply_reordering_sleep_apnea_enabled', value: true },
          ],
        },
      });
    },
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
*/
