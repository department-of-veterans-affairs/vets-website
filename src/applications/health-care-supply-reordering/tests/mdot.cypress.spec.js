import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../config/form';
import manifest from '../manifest.json';

import happyPath from './data/users/gregUserData.json';
import noTempAddress from './data/users/markUserData.json';
import noBatteries from './data/users/jerryUserData.json';
import noAccessories from './data/users/eddieUserData.json';
import USTerritory from './data/users/johnUserData.json';
import foreignAddress from './data/users/consuelaUserData.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'testData',

    dataSets: [
      'happyPath',
      'noTempAddress',
      'noBatteries',
      'noAccessories',
      'USTerritory',
      'foreignAddress',
    ],

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
            cy.get('select[name="root_temporaryAddress_country"]').select(
              'CAN',
            );
            cy.get('input[name="root_temporaryAddress_street"]').clear();
            cy.get('input[name="root_temporaryAddress_street"]').type(
              '205 Test Lane',
            );
            cy.get('input[name="root_temporaryAddress_city"]').clear();
            cy.get('input[name="root_temporaryAddress_city"]').type('Calgary');
            cy.get('select[name="root_temporaryAddress_state"]').select(
              'Alberta',
            );
            cy.get('input[name="root_temporaryAddress_postalCode"]').clear();
            cy.get('input[name="root_temporaryAddress_postalCode"]').type(
              'T1X0L4',
            );
            cy.findByText(/Save temporary address/i).click();
          } else if (testKey === 'foreignAddress') {
            // Don't modify the address for this order.
          } else {
            cy.get('input#permanentAddress').should('be.checked');
            cy.findByText('Edit permanent address', {
              selector: 'button',
            }).click({ force: true });
            cy.get('select[name="root_permanentAddress_country"]').select(
              'USA',
            );
            cy.get('input[name="root_permanentAddress_street"]').clear();
            cy.get('input[name="root_permanentAddress_street"]').type(
              '103 Subbase Rd',
            );
            cy.get('input[name="root_permanentAddress_street2"]').clear();
            cy.get('input[name="root_permanentAddress_street2"]').type(
              'St Thomas',
            );
            cy.get('input[name="root_permanentAddress_city"]').clear();
            cy.get('input[name="root_permanentAddress_city"]').type(
              'Charlotte Amalie West',
            );
            cy.get('select[name="root_permanentAddress_state"]').select(
              'Virgin Islands',
            );
            cy.get('input[name="root_permanentAddress_postalCode"]').clear();
            cy.get('input[name="root_permanentAddress_postalCode"]').type(
              '00802',
            );
            cy.findByText(/Save permanent address/i).click();
          }
        });
      },
      supplies: () => {
        cy.get('@testKey').then(testKey => {
          if (testKey === 'noBatteries') {
            // #1 is "Order batteries for this device"
            // #3 & #5 are "order this accessory" for the available accessories
            cy.get('#3')
              .shadow()
              .find('input')
              .click({ force: true });
            cy.get('#5')
              .shadow()
              .find('input')
              .click({ force: true });
          } else if (testKey === 'noAccessories') {
            cy.get('#1')
              .shadow()
              .find('input')
              .click({ force: true });
          } else {
            cy.get('#1')
              .shadow()
              .find('input')
              .click({ force: true });
            cy.get('#3')
              .shadow()
              .find('input')
              .click({ force: true });
            cy.get('#5')
              .shadow()
              .find('input')
              .click({ force: true });
          }
        });
      },
      'review-and-submit': () => {
        // Confirm that the correct supplies are listed.
        cy.expandAccordions();
        cy.get('@testKey').then(testKey => {
          if (testKey === 'noBatteries') {
            cy.findByText(/DOME/i).should('exist');
            cy.findByText(/WaxBuster Single Unit/i).should('exist');
            cy.findByText(/OMEGAX d3241/i).should('not.exist');
          } else if (testKey === 'noAccessories') {
            cy.findByText(/OMEGAX d3241/i).should('exist');
            cy.findByText(/DOME/i).should('not.exist');
            cy.findByText(/WaxBuster Single Unit/i).should('not.exist');
          } else {
            cy.findByText(/DOME/i).should('exist');
            cy.findByText(/WaxBuster Single Unit/i).should('exist');
            cy.findByText(/OMEGAX d3241/i).should('exist');
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
        } else if (testKey === 'USTerritory') {
          cy.intercept('GET', '/v0/user', USTerritory);
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
        } else if (testKey === 'foreignAddress') {
          cy.intercept('GET', '/v0/user', foreignAddress);
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
