import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../config/form';
import manifest from '../manifest.json';

const dataSetToUserMap = {
  happyPath: 'fx:users/gregUserData',
  noTempAddress: 'fx:users/markUserData',
  noBatteries: 'fx:users/jerryUserData',
  noAccessories: 'fx:users/eddieUserData',
};

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
          cy.findAllByText(/order/i, { selector: 'button' })
            .first()
            .click();
        });
      },
      address: () => {
        cy.get('@testKey').then(testKey => {
          if (testKey === 'noTempAddress') {
            cy.findByText('Add a temporary address', {
              selector: 'button',
            }).click();
            cy.findByLabelText(/Country/i).select('Canada');
            cy.findAllByLabelText(/Street address/i)
              .first()
              .type('205 Test Lane');
            cy.findByLabelText(/City/i).type('Calgary');
            cy.findByLabelText(/Province/i).type('Alberta');
            cy.findByLabelText(/International Postal Code/i).type('T7N');
            cy.findByText(/Save temporary address/i).click();
            cy.findByLabelText(/Re-enter email address/i).type('vet@vet.com');
          } else {
            cy.findByText('Edit permanent address', {
              selector: 'button',
            }).click();
            cy.findByLabelText(/Country/i).select('Canada');
            cy.findByLabelText(/Province/i).type('Alberta');
            cy.findByLabelText(/International Postal Code/i).type('T7N');
            cy.findByText(/Save permanent address/i).click();
            cy.findByLabelText(/Re-enter email address/i).type('vet@vet.com');
          }
        });
      },
      supplies: () => {
        cy.get('@testKey').then(testKey => {
          if (testKey === 'noBatteries') {
            cy.get('#3').click();
            cy.get('#5').click();
          } else if (testKey === 'noAccessories') {
            cy.get('#1').click();
          } else {
            cy.get('#1').click();
            cy.get('#3').click();
            cy.get('#5').click();
          }
        });
      },
    },

    setupPerTest: () => {
      let postData = [];
      cy.get('@testKey').then(testKey => {
        cy.login(dataSetToUserMap[testKey]);
        cy.route('GET', '/v0/user', dataSetToUserMap[testKey]);
        if (testKey === 'noBatteries') {
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
          postData = [
            {
              status: 'Order Processed',
              orderId: 2326,
              productId: 1,
            },
          ];
        } else {
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
        cy.route('GET', '/v0/in_progress_forms/MDOT', testData);
      });
      cy.get('@testKey').then(() => {
        cy.route('POST', '/v0/mdot/supplies', postData);
      });
    },
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
