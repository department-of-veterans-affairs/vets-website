import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../config/form';
import manifest from '../manifest.json';
import paulineUserData from './data/users/paulineUserData.json';
import noItemsEligibleData from './data/noItemsEligible.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'formData',
    dataSets: ['noItemsEligible'],
    fixtures: {
      data: path.join(__dirname, 'data'),
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
        cy.findAllByLabelText(/Email address/i)
          .first()
          .type('vet@vet.com');
        cy.findByLabelText(/Re-enter email address/i).type('vet@vet.com');
        cy.findByText(/Continue/i).click();
      },

      supplies: () => {
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
      cy.route('GET', '/v0/user', paulineUserData);
      cy.route('GET', '/v0/in_progress_forms/MDOT', noItemsEligibleData);
      cy.route('POST', '/v0/mdot/supplies', 500);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
