describe('Homepage Smoke Test', () => {
  it('Renders the introduction page', () => {
    cy.visit('/');
    cy.get('body').should('be.visible');
  });
});
