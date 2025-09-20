// Wait for both the scaffold spinner and the React-Suspense fallback to disappear.
// Usage: cy.waitForAppLoad();
Cypress.Commands.add('waitForAppLoad', (timeout = 20000) => {
  // Wait until the VA grey scaffold spinner container is gone
  cy.get('.loading-indicator-container', { timeout }).should('not.exist');

  // Wait until the React.lazy Suspense fallback is gone
  cy.get('va-loading-indicator', { timeout }).should('not.exist');

  cy.log('Application finished lazy-loading');
});
