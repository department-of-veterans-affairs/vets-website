// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import '@testing-library/cypress/add-commands';

// Mock user login
/* eslint-disable camelcase */
Cypress.Commands.add('initUserMock', (token, level) => {
  cy.request('POST', 'http://localhost:3000/mock', {
    ...{
      path: '/v0/user',
      verb: 'get',
      value: {
        data: {
          attributes: {
            profile: {
              sign_in: {
                service_name: 'idme',
              },
              email: 'fake@fake.com',
              loa: { current: level },
              first_name: 'Jane',
              middle_name: '',
              last_name: 'Doe',
              gender: 'F',
              birth_date: '1985-01-01',
              verified: level === 3,
            },
            veteran_status: {
              status: 'OK',
              is_veteran: true,
              served_in_military: true,
            },
            in_progress_forms: [
              {
                // form: VA_FORM_IDS.FORM_10_10EZ,
                metadata: {},
              },
            ],
            // prefills_available: [VA_FORM_IDS.FORM_21_526EZ],
            services: [
              'facilities',
              'hca',
              'edu-benefits',
              'evss-claims',
              'form526',
              'user-profile',
              'health-records',
              'rx',
              'messaging',
            ],
            va_profile: {
              status: 'OK',
              birth_date: '19511118',
              family_name: 'Hunter',
              gender: 'M',
              given_names: ['Julio', 'E'],
              active_status: 'active',
            },
          },
        },
        meta: { errors: null },
      },
    },
    token,
  })
    .its('body')
    .then(() => {
      //
    });
});
/* eslint-enable camelcase */

/**
 * Fills in a date.
 *
 * @param {String} fieldName The name the field without the Month, Day, or Year
 *                           e.g. root_spouseInfo_remarriageDate
 * @param {String} dateString The date as a string
 *                            e.g. 1990-1-28
 */
Cypress.Commands.add('fillDate', (fieldName, dateString) => {
  const date = dateString.split('-');
  cy.get(`#${fieldName}Month`)
    .select(parseInt(date[1], 10).toString())
    .should('have.value', parseInt(date[1], 10).toString());

  cy.get(`#${fieldName}Day`)
    .select(parseInt(date[2], 10).toString())
    .should('have.value', parseInt(date[2], 10).toString());

  cy.get(`#${fieldName}Year`).type(parseInt(date[0], 10).toString());
});
