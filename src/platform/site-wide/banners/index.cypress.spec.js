import Timeouts from 'platform/testing/e2e/timeouts';

const SELECTORS = {
  HOMEPAGE_BANNER: '[data-e2e-id="homepage-banner"]',
  MAINTENANCE_BANNER_DOWNTIME: '[data-e2e-id="maintenance-banner-downtime"]',
  MAINTENANCE_BANNER_PRE_DOWNTIME:
    '[data-e2e-id="maintenance-banner-pre-downtime"]',
};

describe('Banner A11y Check', () => {
  // Test skipped as it was disabled in Nightwatch
  it.skip('Passes accessibility checks', () => {
    cy.visit('/');
    cy.get('body', { timeout: Timeouts.slow }).should('be.visible');
    cy.get(SELECTORS.HOMEPAGE_BANNER).should('be.visible');
    cy.injectAxeThenAxeCheck();

    cy.get('body', { timeout: Timeouts.slow }).should('be.visible');
    cy.get(SELECTORS.MAINTENANCE_BANNER_PRE_DOWNTIME).should('be.visible');
    cy.axeCheck();

    cy.get('body', { timeout: Timeouts.slow }).should('be.visible');
    cy.get(SELECTORS.MAINTENANCE_BANNER_DOWNTIME).should('be.visible');
    cy.axeCheck();
  });
});
