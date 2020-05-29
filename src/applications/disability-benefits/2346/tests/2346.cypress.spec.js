import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../config/form';
import manifest from '../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['2346-data'],
    fixtures: {
      data: path.join(__dirname, 'data'),
    },
    pageHooks: {
      introduction: () => {
        cy.login();
        cy.findAllByText(/start/i, { selector: 'button' })
          .first()
          .click();
      },

      'veteran-information': () => {
        cy.get('.vads-u-border-left--7px.vads-u-border-color--primary')
          .should('include', '1200')
          .should('include', 'April 05, 1933')
          .should('include', 'Male');

        cy.findAllByText(/continue/i)
          .first()
          .click();
      },
      'veteran-information/addresses': () => {
        cy.get('#permanentAddress')
          .its('checked')
          .should('eq', true);

        cy.get('#temporaryAddress')
          .its('checked')
          .should('eq', false);

        cy.get('#temporaryAddress').click();

        cy.get('#permanentAddress')
          .its('checked')
          .should('eq', false);

        cy.get('#temporaryAddress')
          .its('checked')
          .should('eq', true);

        cy.get('.vads-c-link')
          .first()
          .click();

        cy.get('#root_permanentAddress_country').select('Canada');
        cy.get('#root_permanentAddress_city').type('test city');
        cy.get('.update-button')
          .first()
          .click();

        cy.get('.vads-u-border-left--7px.vads-u-border-color--primary')
          .should('include', 'Canada')
          .should('include', 'test city');

        cy.get('#root_confirmationEmail').type('test2@test1.net');
        cy.findAllByText(/continue/i)
          .first()
          .click();
      },
      batteries: () => {
        cy.get('.battery-page')
          .should('include', 'OMEGAX d3241')
          .should('include', 'Prescribed December 20, 2019')
          .should('include', 'Battery: 1')
          .should('include', 'Quantity: 60')
          .should('include', 'Last order date: 12/25/2019');

        cy.get('input[name="1"]').click();
        cy.get('.additional-info-title').click();
        cy.findAllByText(
          'Find contact information for your local VA medical center',
        ).first();
        cy.findAllByText(/continue/i)
          .first()
          .click();
      },
    },

    setup: () => {
      cy.log('Log before starting tests.');
    },

    // setupPerTest: () => {
    //   // `cy.server` is already'Log before starting tests.'start adding routes.

    //   cy.route({
    //     method: 'GET',
    //     url: '/v0/endpoint',
    //     response: { body: 'mock body' },
    //   });

    //   cy.route({
    //     method: 'POST',
    //     url: '/v0/endpoint',
    //     status: 200,
    //   });
    // },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
