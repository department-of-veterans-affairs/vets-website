const expandCollapsedElement = (el, selector) => {
  cy.wrap(el)
    .shadow()
    .then($shadow => {
      const $collapsed = $shadow.find(selector);
      if ($collapsed.length) cy.wrap($collapsed).click({ force: true });
    });
};

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
      cy.get('va-accordion-item').each($item => {
        expandCollapsedElement($item, 'button[aria-expanded="false"]');
      });
    }

    if ($main.find('va-additional-info').length > 0) {
      cy.get('va-additional-info').each($info => {
        expandCollapsedElement(
          $info,
          'a[role="button"][aria-expanded="false"]',
        );
      });
    }

    if ($main.find('button[aria-expanded="false"]').length > 0) {
      cy.get('main')
        .find('button[aria-expanded="false"]')
        .each($button => {
          cy.wrap($button).click({ force: true });
        });
    }
  });
});
