/**
 * Fills the name form elements.
 *
 * @param {string} baseName The start of the field name for the name elements
 * @param {object} name The name object
 */
Cypress.Commands.add('fillName', (baseName, name) => {
  cy.get(`input[name="${baseName}_first"]`)
    .type(name.first)
    .get(`input[name="${baseName}_middle"]`)
    .type(name.middle)
    .get(`input[name="${baseName}_last"]`)
    .type(name.last)
    .get(`select[name="${baseName}_suffix"]`)
    .select(name.suffix);
});
