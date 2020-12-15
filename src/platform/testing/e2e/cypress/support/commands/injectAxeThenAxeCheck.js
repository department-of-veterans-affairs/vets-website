/**
 * Combines two common, sequentially called functions.
 */
Cypress.Commands.add('injectAxeThenAxeCheck', (context, tempOptions) => {
  cy.injectAxe();

  // axeCheck() context parameter defaults to 'main'
  // axeCheck() tempOptions parameter defaults to {}
  if (tempOptions) {
    cy.axeCheck(context, tempOptions);
  } else if (context) {
    cy.axeCheck(context);
  } else {
    cy.axeCheck();
  }
});
