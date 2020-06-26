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

    // dataSets: ['happyPath', 'noTempAddress', 'noBatteries', 'noAccessories'],

    fixtures: {
      data: path.join(__dirname, 'data'),
      users: path.join(__dirname, 'data/users'),
    },

    pageHooks: {
      introduction: () => {
        cy.findAllByText(/order/i, { selector: 'button' })
          .first()
          .click();
      },
      address: () => {
        cy.get('@testKey').then(testKey => {
          if (testKey === 'noTempAddress') {
            cy.findByText('Add a temporary address', {
              selector: 'button',
            }).click();
            cy.findByLabelText(/Country/i).select('Canada');
            cy.findByLabelText(/Street address/i).type('205 Test Lane');
            cy.findByLabelText(/City/i).type('Calgary');
            cy.findByLabelText(/Province/i).type('Alberta');
            cy.findByLabelText(/International Postal Code/i).type('T7N');
            cy.findByText(/Save temporary address/i).click();
            cy.findByLabelText(/Re-enter email address/i).type('vet@vet.com');
            cy.findByText(/Continue/i).click();
          } else {
            cy.findByText('Edit permanent address', {
              selector: 'button',
            }).click();
            cy.findByLabelText(/Country/i).select('Canada');
            cy.findByLabelText(/Province/i).type('Alberta');
            cy.findByLabelText(/International Postal Code/i).type('T7N');
            cy.findByText(/Save permanent address/i).click();
            cy.findByLabelText(/Re-enter email address/i).type('vet@vet.com');
            cy.findByText(/Continue/i).click();
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
          cy.findByText(/Continue/i, { selector: 'button' }).click();
        });
      },
    },

    setupPerTest: () => {
      cy.get('@testKey').then(testKey => {
        cy.login();
        cy.route('GET', 'v0/user', dataSetToUserMap[testKey]);
      });
      cy.get('@testData').then(testData => {
        cy.route('GET', 'v0/in_progress_forms/MDOT', testData);
      });
      cy.route('POST', '/v0/mdot/supplies', null);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
