describe('Your VA debt and bills', () => {
  // Skip tests in CI until the app is released.
  // Remove this block when the app has a content page in production.
  before(function() {
    if (Cypress.env('CI')) this.skip();
  });

  beforeEach(() => {
    cy.visit('/debts-and-bill/');
    cy.injectAxe();
  });

  it('displays overview page', () => {
    cy.findByTestId('overview-page-title').should('exist');
    cy.axeCheck();
  });
});
