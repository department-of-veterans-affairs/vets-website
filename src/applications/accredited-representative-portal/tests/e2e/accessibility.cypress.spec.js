describe('Accessibility', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [
          { name: 'accredited_representative_portal_frontend', value: true },
        ],
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

  it('has accessible POA requests page', () => {
    cy.visit('/representatives/poa-requests');
    cy.injectAxe();
    cy.axeCheck();
  });
});
