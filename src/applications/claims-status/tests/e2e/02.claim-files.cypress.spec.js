import claimsList from './fixtures/mocks/claims-list.json';

const Timeouts = require('platform/testing/e2e/timeouts.js');

let mockDetails = {};

beforeEach(() => {
  cy.initClaimDetailMocks(false, true, false, 8).then(data => {
    mockDetails = data;
  });
});

describe('Claim Files Test', () => {
  it('Gets files properly', () => {
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
        cy.get('.file-request-list-item', { timeout: Timeouts.normal }).should(
          'be.visible',
        );
        cy.injectAxeThenAxeCheck();
      });

    cy.url().should('contain', '/your-claims/11/files');

    cy.get('a.va-tab-trigger.va-tab-trigger--current').should(
      'contain',
      'Files',
    );

    // should show two files requested
    cy.get('.file-request-list-item').should('have.length', 3);

    // should show four files received
    cy.get('.submitted-file-list-item').should('have.length', 3);

    // should show additional evidence box
    cy.get('.submit-additional-evidence .usa-alert').should('be.visible');

    // should show a submitted date message
    cy.get('.submitted-file-list-item:last-child .submission-status').should(
      'contain',
      'Submitted',
    );

    // should show a reviewed date message
    cy.get('.submitted-file-list-item .submission-status').should(
      'contain',
      'Reviewed by VA',
    );
  });
});
