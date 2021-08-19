const Timeouts = require('platform/testing/e2e/timeouts.js');

import claimsList from './fixtures/mocks/claims-list.json';

let mockDetails = {};

beforeEach(() => {
  cy.initClaimDetailMocks(false, true, false, 8).then(data => {
    mockDetails = data;
  });
});

describe('Claim Details Test', () => {
  it('Shows the correct details', () => {
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

    // go to details tab
    cy.get('.va-tabs li:nth-child(3) > a')
      .click()
      .then(() => {
        cy.get('.claim-details').should('be.visible');
        cy.injectAxeThenAxeCheck();
      });

    cy.url().should('contain', '/your-claims/11/details');

    cy.get('a.va-tab-trigger.va-tab-trigger--current').should(
      'contain',
      'Details',
    );
    cy.get('.claim-detail-label:nth-of-type(1)').should(
      'contain',
      'Claim type',
    );
    cy.get('.claim-detail-label:nth-of-type(2)').should(
      'contain',
      'What you’ve claimed',
    );
    cy.get('.claim-detail-label:nth-of-type(3)').should(
      'contain',
      'Date received',
    );
    cy.get('.claim-detail-label:nth-of-type(4)').should(
      'contain',
      'Your representative for VA claims',
    );
  });
});
