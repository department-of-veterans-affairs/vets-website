import claimsList from './fixtures/mocks/claims-list.json';

const Timeouts = require('platform/testing/e2e/timeouts.js');

let mockDetails = {};

beforeEach(() => {
  cy.initClaimDetailMocks(false, true, false, 3).then(data => {
    mockDetails = data;
  });
});

describe('Ask VA Claim Test', () => {
  it('Submits the form', () => {
    cy.intercept('POST', `/v0/evss_claims/11/request_decision`, {
      body: {},
    }).as('askVA');
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
        cy.injectAxeThenAxeCheck();
      });

    // go to files taba
    cy.get('.va-tabs li:nth-child(2) > a')
      .click()
      .then(() => {
        cy.get('.file-request-list-item', { timeout: Timeouts.normal }).should(
          'be.visible',
        );
        cy.axeCheck();
      });

    // alert is visible
    cy.get('.claims-alert-status')
      .should('be.visible')
      .then(status => {
        cy.wrap(status).should('contain', 'Ask for your Claim Decision');
      });

    // click on link to page
    cy.get('.claims-alert-status a')
      .click()
      .then(() => {
        cy.get('.usa-button-secondary', { timeout: Timeouts.normal });
        cy.axeCheck();
      });

    // click on disabled button
    cy.get('.main .usa-button-primary').click({ force: true });

    // should not have changed pages
    cy.url().should('contain', 'ask-va-to-decide');

    // click on checkbox, then submit, expect success message
    cy.get('input[type=checkbox]')
      .click()
      .then(() => {
        cy.get('.main .usa-button-primary').click();
        cy.wait('@askVA');
      });

    // should have gone back to status page
    cy.url().should('contain', 'status');

    cy.get('.usa-alert-success', { timeout: Timeouts.normal }).should(
      'be.visible',
    );
    cy.axeCheck();
  });
});
