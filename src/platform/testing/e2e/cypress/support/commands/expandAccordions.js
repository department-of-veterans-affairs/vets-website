/**
 * Expands all Accordions and AdditionalInfo components.
 * Web Components that require Shadow DOM broken out from React Components
 */
Cypress.Commands.add('expandAccordions', () => {
  Cypress.log();

  cy.get('main').then($main => {
    const accordionMultiOpenSelector = 'va-accordion:not([open-single])';
    // Click "Expand all" button on va-accordion if it exists
    if ($main.find(accordionMultiOpenSelector).length > 0)
      cy.get(accordionMultiOpenSelector)
        .shadow()
        .find('button[aria-label="Expand all accordions"]')
        .click({ force: true });
    // Check if va-additional-info Web Component exists
    if ($main.find('va-additional-info').length > 0) {
      cy.get('va-additional-info')
        .shadow()
        .then(additionalInfo => {
          // If it exists and Additional Info is not already expanded
          if (
            additionalInfo.find('a[role="button"][aria-expanded=false]')
              .length > 0
          ) {
            cy.get('va-additional-info')
              .shadow()
              .find('a[role="button"][aria-expanded=false]')
              .each(button => {
                // Click to open Additional Info
                cy.wrap(button).click({ force: true });
              });
          }
        });
    }
    // Check if AdditionalInfo and/or Accordion React Components exist
    // Check that the component is not already expanded
    if ($main.find('button[aria-expanded=false]').length > 0) {
      cy.get('main')
        .find('button[aria-expanded=false]')
        .each(button => {
          // Click to open Accordion or Additional Info
          cy.wrap(button).click({ force: true });
        });
    }
  });
});
