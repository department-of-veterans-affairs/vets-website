describe('Unauthed User Flow Test', () => {
  it('Provides the correct experience', () => {
    const appPaths = [
      // While the page is in maintenance, it doesn't need authed
      '/education/gi-bill/post-9-11/ch-33-benefit/status',
      '/records/download-va-letters/letters',
      '/track-claims',
    ];

    appPaths.forEach(path => {
      cy.visit(path);
      cy.get('body').should('be.visible');
      cy.get('.login').should('be.visible');
      cy.get('h1').should('contain', 'Sign in');
    });
  });
});
