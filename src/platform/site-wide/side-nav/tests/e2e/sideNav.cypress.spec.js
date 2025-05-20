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
  beforeEach(() => {
    // Add cache-busting headers
    cy.intercept('**/*', req => {
      req.reply(res => {
        res.headers['cache-control'] = 'no-cache, no-store, must-revalidate';
        res.headers.pragma = 'no-cache';
        res.headers.expires = '0';
      });
    });
  });

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
