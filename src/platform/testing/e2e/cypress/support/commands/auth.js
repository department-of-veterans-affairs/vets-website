const process = require('process');
const Timeouts = require('platform/testing/e2e/timeouts');
const VA_FORM_IDS = require('platform/forms/constants').VA_FORM_IDS;

Cypress.Commands.add('setUserSession', token => {
  cy.setCookie('token', token, { httpOnly: true }).then(() => {
    localStorage.setItem('hasSession', true);
  });
});
/* eslint-disable camelcase */

Cypress.Commands.add('getDefaultUserResponse', level => {
  return {
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
            form: VA_FORM_IDS.FORM_10_10EZ,
            metadata: {},
          },
        ],
        prefills_available: [
          VA_FORM_IDS.FORM_21_526EZ,
          VA_FORM_IDS.FORM_22_0994,
        ],
        services: [
          'facilities',
          'hca',
          'edu-benefits',
          'evss-claims',
          'user-profile',
          'health-records',
          'rx',
          'messaging',
          'form-save-in-progress',
          'form-prefill',
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
  };
});
/* eslint-enable camelcase */

Cypress.Commands.add('initUserMock', (token, level, userData) => {
  cy.getDefaultUserResponse(level).then(data => {
    cy.intercept('/v0/user', userData || data);
  });
});

let tokenCounter = 0;
Cypress.Commands.add('getUserToken', () => {
  return `token-${process.pid}-${tokenCounter++}`;
});

Cypress.Commands.add('logIn', (token, url, level, userData) => {
  cy.initUserMock(token, level, userData).then(() => {
    cy.visit(url);
    cy.get('body', { timeout: Timeouts.normal }).should('be.visible');

    cy.setUserSession(token).then(() => {
      cy.visit(url);
      cy.get('body', { timeout: Timeouts.normal }).should('be.visible');
    });
  });
});

Cypress.Commands.add('testUnauthedUserFlow', path => {
  cy.visit(path);
  cy.get('body', { timeout: Timeouts.normal }).should('be.visible');
  cy.get('.login', { timeout: Timeouts.normal })
    .should('be.visible')
    .then(loginElement => {
      cy.wrap(loginElement).should('match', 'h1');
      cy.wrap(loginElement).should('contain', 'Sign in to VA.gov');
    });
});
