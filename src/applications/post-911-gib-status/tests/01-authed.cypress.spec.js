import Timeouts from 'platform/testing/e2e/timeouts';
import enrollmentData from './fixtures/mocks/enrollmentData.json';
import backendStatus from './fixtures/mocks/backendStatus.json';

describe('Gibs Test', () => {
  it('Fills the form', () => {
    cy.login();
    cy.intercept('GET', '/v0/post911_gi_bill_status', enrollmentData).as(
      'enrollmentData',
    );
    cy.intercept('GET', '/v0/backend_statuses/gibs', backendStatus).as(
      'backendStatus',
    );
    cy.intercept('GET', '/v0/feature_toggles?&cookie_id=*', {
      data: {
        features: [],
      },
    }).as('featureToggles');

    cy.visit('/education/gi-bill/post-9-11/ch-33-benefit');
    cy.get('body').should('be.visible');
    cy.injectAxeThenAxeCheck();
    cy.get('a[href="/education/gi-bill/post-9-11/ch-33-benefit/status"]', {
      timeout: Timeouts.slow,
    }).click();

    cy.get('#gibs-full-name').should('contain', 'First Last');

    cy.get('#enrollment-0 h4').should(
      'contain',
      '11/01/2012 to 12/01/2012 at purdue university',
    );

    cy.get('#print-button').click();
    cy.get('.print-status', { timeout: Timeouts.slow }).should('be.visible');
    cy.injectAxeThenAxeCheck();
    cy.get('.section-header')
      .should('contain', 'Post-9/11 GI Bill')
      .and('contain', 'Statement of Benefits');
  });
});
