import claimsList from './fixtures/mocks/claims-list.json';

const Timeouts = require('platform/testing/e2e/timeouts.js');

let mockDetails = {};

beforeEach(() => {
  cy.initClaimDetailMocks(false, true, false, 8).then(data => {
    mockDetails = data;
  });
});

describe('Claim Additional Evidence Test', () => {
  it('Submits files', () => {
    cy.intercept('GET', `/v0/evss_claims_async/11`, mockDetails).as(
      'detailRequest',
    );
    cy.intercept('GET', `/v0/evss_claims_async`, claimsList).as('claim');
    cy.login();

    cy.visit('/track-claims');
    cy.get('.claim-list-item-container', { timeout: Timeouts.slow }).should(
      'be.visible',
    );

    cy.get('.claim-list-item-container:first-child a.vads-c-action-link--blue')
      .click()
      .then(() => {
        cy.get('.claim-title', { timeout: Timeouts.slow }).should('be.visible');
      });

    // go to files taba
    cy.get('.va-tabs li:nth-child(2) > a')
      .click()
      .then(() => {
        cy.get('.file-request-list-item').should('be.visible');
      });

    cy.get('button.usa-button')
      .click()
      .then(() => {
        cy.get('.usa-input-error');
        cy.injectAxeThenAxeCheck;
      });

    cy.get('.usa-input-error-message').should(
      'contain',
      'Please select a file first',
    );

    // File uploads don't appear to work in Nightwatch/PhantomJS
    // TODO: switch to something that does support uploads or figure out the problem

    // The above comment lifted from the old Nightwatch test.  Cypress can test file uploads, however this would need to be written in a future effort after our conversion effort is complete.
  });
});
