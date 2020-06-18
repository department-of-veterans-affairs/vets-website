import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../config/form';
import manifest from '../manifest.json';
import markUserData from './data/users/markUserData.json';
import noTempAddressData from './data/noTempAddress.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'formData',

    dataSets: ['noTempAddress'],

    fixtures: {
      data: path.join(__dirname, 'data'),
    },

    pageHooks: {
      introduction: () => {
        cy.findAllByText(/order/i, { selector: 'button' })
          .first()
          .click();
      },

      address: () => {
        cy.findAllByText('Add a temporary address', { selector: 'button' })
          .first()
          .click();
        cy.findByLabelText(/Country/i).select('Canada');
        cy.findByLabelText(/Street address/i).type('205 Test Lane');
        cy.findByLabelText(/City/i).type('Calgary');
        cy.findByLabelText(/Province/i).type('Alberta');
        cy.findByLabelText(/International Postal Code/i).type('T7N');
        cy.findByText(/Save temporary address/i).click();
        cy.findAllByLabelText(/Email address/i)
          .first()
          .type('vet@vet.com');
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
      cy.login();
      cy.route('GET', '/v0/user', markUserData);
      cy.route('GET', '/v0/in_progress_forms/MDOT', noTempAddressData);
      cy.route('POST', '/v0/mdot/supplies', 200);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
