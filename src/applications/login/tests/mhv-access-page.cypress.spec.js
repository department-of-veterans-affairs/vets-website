describe('My HealtheVet Access Page', () => {
  beforeEach(() => {
    cy.visit('/sign-in/mhv');
  });

  it('displays the page title and description', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('#signin-signup-modal-title')
      .should('exist')
      .and('contain', 'Access the My HealtheVet sign-in option');
    cy.get('p.vads-u-measure--5')
      .should('exist')
      .and(
        'contain',
        "If you received confirmation from VA that we've given you temporary access to My HealtheVet, you can sign in here.",
      );
  });

  it('displays a sign-in button and respond to clicks', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('va-button[text="My HealtheVet"]').should('exist');
    cy.get('[data-testid="accessMhvBtn"]').click();
  });

  it('should display the "Having trouble signing in?" section', () => {
    cy.injectAxeThenAxeCheck();
    cy.contains('h2', 'Having trouble signing in?').should('exist');
    cy.contains(
      'p',
      'Contact the administrator who gave you access to this page.',
    ).should('exist');
  });
});
