/**
 * Combines two function calls.
 */
Cypress.Commands.add('injectAxeThenAxeCheck', () => {
  cy.injectAxe();
  cy.axeCheck();
});