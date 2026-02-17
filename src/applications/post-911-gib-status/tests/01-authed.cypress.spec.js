import Timeouts from 'platform/testing/e2e/timeouts';
import enrollmentData from './fixtures/mocks/enrollmentData.json';
import backendStatus from './fixtures/mocks/backendStatus.json';

describe('Gibs Test', () => {
  it('Fills the form (SOB claimant service enabled)', () => {
    cy.login();

    // When sob_claimant_service is ON, the frontend should call the SOB endpoint
    cy.intercept('GET', '**/sob/v0/ch33_status', enrollmentData).as(
      'enrollmentData',
    );

    cy.intercept('GET', '**/v0/backend_statuses/gibs', backendStatus).as(
      'backendStatus',
    );

    // Enable the SOB feature flag
    cy.intercept('GET', '**/v0/feature_toggles*', {
      data: {
        features: [
          {
            name: 'sob_claimant_service',
            value: true,
          },
        ],
      },
    }).as('featureToggles');

    cy.visit('/education/gi-bill/post-9-11/ch-33-benefit');
    cy.wait('@featureToggles');
    cy.get('body').should('be.visible');
    cy.injectAxeThenAxeCheck();
    cy.get(
      'a[href="/education/check-remaining-post-9-11-gi-bill-benefits/status"]',
      {
        timeout: Timeouts.slow,
      },
    ).click();

    cy.wait('@enrollmentData');
    cy.get('#gibs-full-name').should('contain', 'Jane Smith');

    cy.get('#print-button').click();
    cy.get('.print-status', { timeout: Timeouts.slow }).should('be.visible');
    cy.injectAxeThenAxeCheck();
    cy.get('.section-header')
      .should('contain', 'Post-9/11 GI Bill')
      .and('contain', 'Statement of Benefits');
  });
});
