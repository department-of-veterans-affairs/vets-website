/**
 * Expands all accordions and AdditionalInfo components.
 */
Cypress.Commands.add('expandAccordions', () => {
  Cypress.log();

  cy.get('main').then($main => {
    const accordions = $main.find('button[aria-expanded=false]');
    if (accordions.length) {
      cy.wrap(accordions).each(button => {
        cy.wrap(button).click();
      });
    }
  });
});
