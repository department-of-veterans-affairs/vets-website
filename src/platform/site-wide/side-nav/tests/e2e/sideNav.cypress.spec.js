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

describe.skip('Facilities VAMC SideNav', () => {
  before(function() {
    if (Cypress.env('CIRCLECI')) this.skip();
  });

  it('should tab access the links on the left nav and verify focus', () => {
    cy.visit('/pittsburgh-health-care');
    cy.injectAxe();
    cy.axeCheck();

    // Accept initial modal and start atop
    if (Cypress.$('body').find('#modal-announcement')) {
      cy.get('#modal-announcement')
        .get('.va-modal-close')
        .first()
        .click();
    }

    // Start tab access
    cy.get('.va-sidenav-item-label')
      .first()
      .focus();

    cy.tabFocus('.va-sidenav-level-2 a');
  });
});
