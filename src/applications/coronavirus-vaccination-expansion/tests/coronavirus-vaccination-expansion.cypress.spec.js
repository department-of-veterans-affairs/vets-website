import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataSets: [
      'test-data-veteran',
      'test-data-spouse',
      'test-data-caregiver',
      'test-data-champva',
    ],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
    },

    pageHooks: {
      introduction: () => {
        cy.get('#introductionRadios-1').check();
        cy.findByText(/continue/i, { selector: 'button' })
          .first()
          .click();

        cy.injectAxe();
      },
      verify: () => {
        cy.fillPage();
      },
      'vaccine-location': () => {
        cy.wait('@getFacilities');
        cy.get('.errorable-radio-button > input')
          .first()
          .check();
      },
      confirmation: () => {
        cy.get('h2').contains("We've received your information");
      },
    },

    setupPerTest: () => {
      cy.intercept('GET', '/covid_vaccine/v0/facilities/97214', {
        statusCode: 200,
        body: {
          data: [
            {
              id: 'vha_648',
              type: 'vaccination_facility',
              attributes: {
                name: 'Portland VA Medical Center',
                distance: 2.31,
                city: 'Portland',
                state: 'OR',
              },
            },
            {
              id: 'vha_663',
              type: 'vaccination_facility',
              attributes: {
                name: 'Seattle VA Medical Center',
                distance: 142.35,
                city: 'Seattle',
                state: 'WA',
              },
            },
            {
              id: 'vha_653',
              type: 'vaccination_facility',
              attributes: {
                name: 'Roseburg VA Medical Center',
                distance: 161.95,
                city: 'Roseburg',
                state: 'OR',
              },
            },
            {
              id: 'vha_687',
              type: 'vaccination_facility',
              attributes: {
                name: 'Jonathan M. Wainwright Memorial VA Medical Center',
                distance: 209.89,
                city: 'Walla Walla',
                state: 'WA',
              },
            },
            {
              id: 'vha_692',
              type: 'vaccination_facility',
              attributes: {
                name: 'White City VA Medical Center',
                distance: 212.66,
                city: 'White City',
                state: 'OR',
              },
            },
          ],
        },
      }).as('getFacilities');

      cy.intercept('POST', '/covid_vaccine/v0/expanded_registration', {
        statusCode: 200,
        body: {},
      }).as('submitForm');
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
