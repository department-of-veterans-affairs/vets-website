/**
 * Go to error page for an invalid profile
 * @type {{"Begin application": function(*=): void}|{"Begin application": function(*=): void}}
 */

Cypress.on('uncaught:exception', (_err, _runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

describe('Profile Page', () => {
  it('Axe check when error is present', () => {
    cy.visit(`/gi-bill-comparison-tool/profile/99999999`).injectAxe();
    cy.axeCheck();
  });
});
