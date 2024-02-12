describe('Accessibility', () => {
  // Skip tests in CI until the app is released.
  // Remove this block when the app has a content page in production.
  before(() => {
    if (Cypress.env('CI')) this.skip();
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [{ name: 'representativesPortalFrontend', value: true }],
      },
    });
  });

  it('has accessible landing page', () => {
    cy.visit('/representatives');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('has accessible dashboard', () => {
    cy.visit('/representatives/dashboard');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('has accessible poa requests page', () => {
    cy.visit('/representatives/poa-requests');
    cy.injectAxe();
    cy.axeCheck();
  });
});
