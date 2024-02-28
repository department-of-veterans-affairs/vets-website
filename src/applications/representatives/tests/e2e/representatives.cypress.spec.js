describe('Representatives', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [{ name: 'representatives_portal_frontend', value: true }],
      },
    });
  });

  it('allows navigation from landing page to dashboard to poa requests', () => {
    cy.visit('/representatives')
      .injectAxe()
      .axeCheck();

    cy.contains('Welcome to Representative.VA.gov');
    cy.contains('Until sign in is added use this to see dashboard').click();

    cy.url()
      .should('include', '/representatives/dashboard')
      .injectAxe()
      .axeCheck();
    cy.contains('Accredited Representative Portal');
    cy.contains('Manage power of attorney requests').click();

    cy.url().should('include', '/representatives/poa-requests');
    cy.injectAxe();
    cy.axeCheck();
    cy.contains('Power of attorney requests');
    cy.get('[data-testid=poa-requests-table]').should('exist');
  });
});
