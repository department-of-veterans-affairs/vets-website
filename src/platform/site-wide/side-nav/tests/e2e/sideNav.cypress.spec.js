describe('Facilities VAMC SideNav', () => {
  beforeEach(function() {
    if (Cypress.env('ci_name') && Cypress.env('ci_name') === 'circle') {
      this.skip();
    }
  });

  it('should tab access the links on the left nav and verify focus', () => {
    if (Cypress.env('ci_name') && Cypress.env('ci_name') === 'circle') return;
    cy.visit('/pittsburgh-health-care');
    cy.injectAxe();
    cy.axeCheck();

    // Accept initial modal and start atop
    cy.findByText(/Continue to the website/i)
      .first()
      .click();
    cy.scrollTo(0, 0);

    // Start tab access level one
    cy.get('.va-sidenav-item-label')
      .first()
      .focus();

    do {
      cy.tab();
      cy.focused().should('have.attr', 'aria-label');
    } while (
      !cy
        .get('.va-sidenav-level-2 a')
        .last()
        .focus()
    );

    // Start tab access level 2
    cy.findByText(/Locations/i, { selector: 'a' })
      .first()
      .click();
    cy.get('.va-sidenav-item-label')
      .first()
      .focus();

    do {
      cy.tab();
      cy.focused().should('have.attr', 'aria-label');
    } while (
      !cy
        .get('.va-sidenav-level-3 a')
        .last()
        .focus()
    );
  });
});
