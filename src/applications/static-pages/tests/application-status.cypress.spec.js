import Timeouts from 'platform/testing/e2e/timeouts';

const VA_FORM_IDS = require('platform/forms/constants').VA_FORM_IDS;

Cypress.Commands.add('testStatus', (page, url) => {
  cy.visit(page);
  cy.get('.sip-application-status').should('be.visible', {
    timeout: Timeouts.slow,
  });
  cy.injectAxeThenAxeCheck();

  cy.get('main a.usa-button-primary').should('have.attr', 'href', url);

  cy.get('.usa-button-secondary', { timeout: Timeouts.normal })
    .should('exist')
    .then(button => {
      cy.wrap(button).click();
    });
  cy.get('#start-over-modal-title', { timeout: Timeouts.normal }).should(
    'contain',
    'Starting over will delete your in-progress application.',
  );
  cy.axeCheck();
});

describe('Application Status Test', () => {
  it('Achieves the correct result per URL', () => {
    cy.login();
    /* eslint-disable camelcase */
    cy.intercept('GET', '/v0/user', {
      data: {
        attributes: {
          profile: {
            sign_in: {
              service_name: 'idme',
            },
            email: 'fake@fake.com',
            loa: { current: 3 },
            first_name: 'Jane',
            middle_name: '',
            last_name: 'Doe',
            gender: 'F',
            birth_date: '1985-01-01',
            verified: true,
          },
          veteran_status: {
            status: 'OK',
            is_veteran: true,
          },
          in_progress_forms: [
            {
              form: VA_FORM_IDS.FORM_10_10EZ,
              metadata: {},
            },
            {
              form: VA_FORM_IDS.FORM_22_1995,
              metadata: {},
            },
            {
              form: VA_FORM_IDS.FORM_21P_530,
              metadata: {},
            },
            {
              form: VA_FORM_IDS.FORM_21P_527EZ,
              metadata: {},
            },
          ],
          prefills_available: [],
          services: [
            'facilities',
            'hca',
            'edu-benefits',
            'evss-claims',
            'user-profile',
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
    });
    /* eslint-enable camelcase */
    cy.testStatus(
      '/health-care/how-to-apply/',
      '/health-care/apply/application/resume',
    );
    cy.testStatus(
      '/health-care/eligibility',
      '/health-care/apply/application/resume',
    );
    cy.testStatus(
      '/pension/how-to-apply/',
      '/pension/application/527EZ/resume',
    );
    cy.testStatus('/pension/eligibility', '/pension/application/527EZ/resume');
    cy.testStatus(
      '/burials-memorials/veterans-burial-allowance/',
      '/burials-and-memorials/application/530/resume',
    );
    cy.testStatus(
      '/education/how-to-apply/',
      '/education/apply-for-education-benefits/application/1995/resume',
    );
    cy.testStatus(
      '/education/eligibility',
      '/education/apply-for-education-benefits/application/1995/resume',
    );
  });
});
