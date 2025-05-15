Cypress.Commands.add('assertChildText', (parentSelect, childSelector, text) => {
  cy.get(parentSelect)
    .find(childSelector)
    .should('contain', text);
});
