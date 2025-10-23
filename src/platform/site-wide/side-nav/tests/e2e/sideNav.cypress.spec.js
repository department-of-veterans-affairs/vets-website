Cypress.Commands.add('tabFocus', el => {
  do {
    cy.tab();
    cy.focused().should('have.attr', 'aria-label');
  } while (
    !cy
      .get(el)
      .last()
      .focus()
  );
});

describe('Facilities VAMC SideNav', () => {
  it('should tab access the links on the left nav and verify focus', () => {
    cy.visit('/pittsburgh-health-care');
    cy.injectAxe();
    cy.axeCheck();

    // Start tab access
    cy.get('.va-sidenav-item-label')
      .first()
      .focus();

    cy.tabFocus('.va-sidenav-level-2 a');
  });
});
