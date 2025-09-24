/**
 * @description Asserts that a child element contains the specified text.
 * @param {string} parentSelector - Parent selector passed to cy.get().
 * @param {string} childSelector - Child selector passed to cy.find().
 * @param {string} text - The text to assert exists in the child element.
 */
Cypress.Commands.add(
  'assertChildText',
  (parentSelector, childSelector, text) => {
    cy.get(parentSelector)
      .find(childSelector)
      .should('contain', text);
  },
);
