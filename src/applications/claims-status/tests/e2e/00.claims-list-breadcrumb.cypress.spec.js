const Timeouts = require('platform/testing/e2e/timeouts.js');

import claimsList from './fixtures/mocks/claims-list.json';

describe('Breadcrumb Test', () => {
  it('Verifies breadcrumb functionality', () => {
    cy.intercept('GET', '/v0/evss_claims_async', claimsList);
    cy.login();
    cy.visit('/track-claims');
    cy.percySnapshot();
    cy.title().should('eq', 'Track Claims: VA.gov');
    cy.get('.claim-list-item-container', { timeout: Timeouts.slow }).should(
      'be.visible',
    );
    cy.get('.va-nav-breadcrumbs').should('be.visible');
    cy.get('.va-nav-breadcrumbs-list').should('be.visible');
    cy.get('a[aria-current="page"').should('be.visible');
    cy.injectAxeThenAxeCheck();

    cy.get(
      '.va-nav-breadcrumbs-list li:nth-of-type(2) a[aria-current="page"]',
    ).should('exist');
    cy.get(
      '.va-nav-breadcrumbs-list li:nth-of-type(2) a[aria-current="page"]',
    ).should('contain', 'Check your claims and appeals');
    cy.get(
      '.va-nav-breadcrumbs-list li:nth-of-type(2) a[aria-current="page"]',
    ).should('have.css', 'pointer-events', 'none');

    cy.viewportPreset('va-top-mobile-1');

    cy.get('.va-nav-breadcrumbs-list').should('be.visible');

    cy.get('.va-nav-breadcrumbs-list li:not(:nth-last-child(2))').should(
      'have.css',
      'display',
      'none',
    );
    cy.get('.va-nav-breadcrumbs-list li:nth-last-child(2)').should(
      'contain',
      'Home',
    );
    cy.get('.va-nav-breadcrumbs-list li:nth-last-child(2)').should(
      'have.css',
      'display',
      'inline-block',
    );

    cy.viewport(1024, 768);
  });
});
