/**
 * Combines two common, sequentially called functions.
 */
Cypress.Commands.add('injectAxeThenAxeCheck', options => {
  cy.injectAxe();
  cy.axeCheck(options);
});
