describe('VAMC', () => {
  before(function() {
    if (Cypress.env('CIRCLECI')) this.skip();
  });

  it('has expected elements', () => {
    cy.visit('/pittsburgh-health-care/');
    cy.viewport(481, 1000);

    cy.get('#sidebar-nav-trigger').should('not.exist');
    cy.get('#sidenav-menu').should('exist');
    cy.get('h1').contains('VA Pittsburgh health care');
    cy.get('h2').contains('Locations');
    cy.get('h3').contains('Manage your health online');
    cy.get('#stories').contains('Stories');
    cy.get('#events').contains('Events');
  });
});
