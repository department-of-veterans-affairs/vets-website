/**
 * Expands all accordions and AdditionalInfo components.
 * Web Components that require Shadow DOM broken out from React Components
 */
Cypress.Commands.add('expandAccordions', () => {
  Cypress.log();

  cy.get('main').then($main => {
    if ($main.find('va-accordion-item').length > 0) {
      // va-accordion-item Web Component Expand
      cy.get('va-accordion-item')
        .shadow()
        .find('button[aria-expanded=false]')
        .each(button => {
          cy.wrap(button).click({ force: true });
        });
    } else if ($main.find('va-additional-info').length > 0) {
      // va-additional-info Web Component Expand
      cy.get('va-additional-info')
        .shadow()
        .find('a[role="button"][aria-expanded=false]')
        .each(button => {
          cy.wrap(button).click({ force: true });
        });
    } else {
      // AdditionalInfo and Accordion React Components Expand
      const accordions = $main.find('button[aria-expanded=false]');
      if (accordions.length) {
        cy.wrap(accordions).each(button => {
          cy.wrap(button).click({ force: true });
        });
      }
    }
  });
});
