describe('Unauthed User Flow Test', () => {
  it('Provides the correct experience', () => {
    const appPaths = [
      // While the page is in maintenance, it doesn't need authed
      // Add Below code after content build code is merged and this code is deployed
      '/education/check-remaining-post-9-11-gi-bill-benefits/status',
      '/records/download-va-letters/letters',
      '/track-claims',
    ];

    appPaths.forEach(path => {
      cy.visit(path);
      cy.get('body').should('be.visible');
      cy.get('.login').should('be.visible');
      cy.get('#signin-signup-modal-title').should('contain', 'Sign in');
    });
  });
});
