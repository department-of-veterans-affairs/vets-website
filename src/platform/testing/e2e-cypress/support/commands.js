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

Cypress.Commands.add('initItfMock', token => {
  cy.request('POST', 'http://localhost:3000/mock', {
    ...{
      path: '/v0/intent_to_file',
      verb: 'get',
      value: {
        data: {
          id: '',
          type: 'evss_intent_to_file_intent_to_files_responses',
          attributes: {
            intentToFile: [
              {
                id: '1',
                creationDate: '2014-07-28T19:53:45.810+00:00',
                expirationDate: Cypress.moment()
                  .add(1, 'd')
                  .format(),
                participantId: 1,
                source: 'EBN',
                status: 'active',
                type: 'compensation',
              },
              {
                id: '1',
                creationDate: '2014-07-28T19:53:45.810+00:00',
                expirationDate: '2015-08-28T19:47:52.788+00:00',
                participantId: 1,
                source: 'EBN',
                status: 'claim_recieved',
                type: 'compensation',
              },
              {
                id: '1',
                creationDate: '2014-07-28T19:53:45.810+00:00',
                expirationDate: '2015-08-28T19:47:52.789+00:00',
                participantId: 1,
                source: 'EBN',
                status: 'claim_recieved',
                type: 'compensation',
              },
              {
                id: '1',
                creationDate: '2014-07-28T19:53:45.810+00:00',
                expirationDate: '2015-08-28T19:47:52.789+00:00',
                participantId: 1,
                source: 'EBN',
                status: 'expired',
                type: 'compensation',
              },
              {
                id: '1',
                creationDate: '2014-07-28T19:53:45.810+00:00',
                expirationDate: '2015-08-28T19:47:52.790+00:00',
                participantId: 1,
                source: 'EBN',
                status: 'incomplete',
                type: 'compensation',
              },
            ],
          },
        },
      },
    },
    token,
  });
});

/* eslint-disable no-unused-vars */
Cypress.Commands.add('runTest', (testData, testConfig, token, fileName) => {
  //
});
/* eslint-enable no-unused-vars */
