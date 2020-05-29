describe('Va.gov', () => {
  it('renders the introduction page', () => {
    cy.visit('/')
      .get('body')
      .should('be.visible');
  });
});
