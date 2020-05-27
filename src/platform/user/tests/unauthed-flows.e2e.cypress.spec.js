describe('Unauthenticated user', () => {
  it('should see the login modal', () => {
    const appPaths = [
      // While the page is in maintenance, it doesn't need authed
      '/education/gi-bill/post-9-11/ch-33-benefit/status',
      '/records/download-va-letters/letters',
      '/track-claims',
    ];

    appPaths.forEach(path => {
      cy.visit(path);
      cy.findByText('Sign in to VA.gov', { selector: 'h1' }).should('exist');
    });
  });
});
