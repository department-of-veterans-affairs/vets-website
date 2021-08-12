const Timeouts = require('platform/testing/e2e/timeouts.js');

import claimsList from './fixtures/mocks/claims-list.json';

describe('Claimst List Test', () => {
  it('Tests consolidated claim functionality', () => {
    cy.intercept('GET', '/v0/evss_claims_async', claimsList);
    cy.login();

    // Claim is visible
    cy.visit('/track-claims');

    // Combined claim link
    cy.get('button.claims-combined').click();
    cy.get('.claims-status-upload-header', { timeout: Timeouts.normal }).should(
      'be.visible',
    );

    // check modal
    cy.injectAxeThenAxeCheck();

    cy.get('.claims-status-upload-header').should(
      'contain',
      'A note about consolidated claims',
    );
    cy.get('.va-modal-close')
      .first()
      .click();
    cy.get('.claims-status.upload-header').should('not.exist');
    cy.axeCheck();

    // Verify text on page
    cy.get('.claims-container-title').should(
      'contain',
      'Check your claim or appeal status',
    );
    cy.get('.claim-list-item-header-v2')
      .first()
      .should('contain', `Claim for disability compensation`)
      .and('contain', 'updated on October 31, 2016');
    cy.get('.claim-list-item-container:first-child a.vads-c-action-link--blue')
      .click()
      .then(() => {
        cy.url().should('contain', '/your-claims/11/status');
      });
  });
});
