/**
 * Combines two common, sequentially called functions.
 */
Cypress.Commands.add('injectAxeThenAxeCheck', () => {
  cy.injectAxe();
  cy.axeCheck();
});
