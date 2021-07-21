import Timeouts from 'platform/testing/e2e/timeouts';

describe('Homepage Smoke Test', () => {
  it('Renders the introduction page', () => {
    cy.visit('/');
    cy.get('body', { timeout: Timeouts.normal }).should('be.visible');
  });
});
