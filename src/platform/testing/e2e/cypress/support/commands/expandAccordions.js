const waitForAccordionHydration = () => {
  cy.get('va-accordion-item', { timeout: 5000 })
    .should('have.length.at.least', 1)
    .each($item => {
      cy.wrap($item)
        .shadow()
        .find('button', { timeout: 5000 })
        .should('exist');
    });
};

/**
 * Expands all Accordions and AdditionalInfo components.
 * Web Components that require Shadow DOM broken out from React Components
 */
Cypress.Commands.add('expandAccordions', () => {
  Cypress.log();

  cy.get('main').then($main => {
    if ($main.find('va-accordion-item').length > 0) {
      waitForAccordionHydration();

      cy.get('va-accordion-item')
        .shadow()
        .find('button[aria-expanded=false]')
        .each($button => {
          cy.wrap($button).click({ force: true });
        });
    }

    if ($main.find('va-additional-info').length > 0) {
      cy.get('va-additional-info')
        .shadow()
        .find('a[role="button"][aria-expanded=false]')
        .each($button => {
          cy.wrap($button).click({ force: true });
        });
    }

    if ($main.find('button[aria-expanded=false]').length > 0) {
      cy.get('main')
        .find('button[aria-expanded=false]')
        .each($button => {
          cy.wrap($button).click({ force: true });
        });
    }
  });
});
