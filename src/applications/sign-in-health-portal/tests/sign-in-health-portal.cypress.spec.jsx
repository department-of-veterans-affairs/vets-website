describe('Sign In Health Portal', () => {
  it('should render the portal removal notice page', () => {
    cy.visit('/sign-in-health-portal/');
    cy.get('h1').should('be.visible');
    cy.get('h1').should(
      'contain',
      'Manage your health care for all VA facilities on VA.gov',
    );
  });
});
