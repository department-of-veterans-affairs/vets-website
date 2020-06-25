import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../config/form';
import manifest from '../manifest.json';
import gregUserData from './data/users/gregUserData.json';
import happyPathData from './data/happyPath.json';

const dataSetToUserMap = {
  happyPath: 'fx:users/gregUserData',
  noTempAddress: 'fx:users/markUserData',
  noBatteries: 'fx:users/jerryUserData',
  noAccessories: 'fx:users/eddieUserData',
  noItemsEligible: 'fx:users/paulineUserData',
};

const testConfig = createTestConfig(
  {
    dataPrefix: 'formData',

    dataSets: [
      'happyPath',
      'noTempAddress',
      'noBatteries',
      'noAccessories',
      'noItemsEligible',
    ],

    fixtures: {
      data: path.join(__dirname, 'data'),
      users: path.join(__dirname, 'data/users'),
    },

    pageHooks: {
      // Due to automatic path resolution, this URL expands to:
      // '/some-form-app-url/introduction'. Either format can be used.
      introduction: () => {
        cy.findAllByText(/order/i, { selector: 'button' })
          .first()
          .click();
      },

      address: () => {
        cy.findAllByText('Edit permanent address', { selector: 'button' })
          .first()
          .click();
        cy.findByLabelText(/Country/i).select('Canada');
        cy.findByLabelText(/Province/i).type('Alberta');
        cy.findByLabelText(/International Postal Code/i).type('T7N');
        cy.findByText(/Save permanent address/i).click();
        cy.findByLabelText(/Re-enter email address/i).type('vet@vet.com');
        cy.findByText(/Continue/i).click();
      },

      supplies: () => {
        cy.get('#1').click();
        cy.get('#3').click();
        cy.get('#5').click();
        cy.findAllByText(/Continue/i, { selector: 'button' })
          .first()
          .click();
      },
    },

    setup: () => {
      cy.log('Logging something before starting tests.');
    },

    setupPerTest: () => {
      cy.get('@testKey').then(testKey => {
        cy.login();
        cy.route('GET', 'v0/user', dataSetToUserMap[testKey]);
        cy.route('GET', 'v0/in_progress_forms/MDOT', happyPathData);
      });
      // cy.route('GET', '/v0/user', gregUserData);
      cy.route('POST', '/v0/mdot/supplies', 200);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
