import manifest from '../manifest.json';

describe(manifest.appName, () => {
  it('is accessible', () => {
    cy.visit(manifest.rootUrl)
      .injectAxe()
      .axeCheck();
    cy.url().should(
      'eq',
      'http://localhost:3001/health-care/connected-devices/',
    );
  });

  it("displays login modal after clicking 'Sign in' for veteran NOT logged in", () => {
    cy.findAllByText('Sign in').click({
      multiple: true,
      force: true,
      waitForAnimations: true,
    });
    // Tests that login modal appears after clicking
    cy.url().should(
      'eq',
      'http://localhost:3001/health-care/connected-devices/?next=loginModal',
    );
    // Tests that the .login div is loaded
    cy.get('.login').should('be.visible');
  });
});
