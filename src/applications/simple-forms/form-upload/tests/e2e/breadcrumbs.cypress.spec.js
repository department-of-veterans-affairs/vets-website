describe('Breadcrumb Test', () => {
  it('Verifies breadcrumb functionality', () => {
    cy.login();
    cy.visit('/form-upload/21-0779');
    cy.title().should('eq', 'Form Upload | Veterans Affairs');
    cy.get('va-breadcrumbs').should('be.visible');
    cy.get('.usa-breadcrumb__list-item').should('have.length', 3);
    cy.injectAxeThenAxeCheck();
    cy.get('va-breadcrumbs')
      .last()
      .should('exist');
  });
});
