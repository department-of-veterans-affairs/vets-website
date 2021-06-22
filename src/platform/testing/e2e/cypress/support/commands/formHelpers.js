Cypress.Commands.add('fill', (selector, value) => {
  if (typeof value !== 'undefined') {
    cy.get(selector)
      .clear()
      .type(value);
  }
});

Cypress.Commands.add('fillName', (baseName, name) => {
  cy.get(`input[name="${baseName}_first"]`)
    .clear()
    .type(name.first);
  cy.get(`input[name="${baseName}_middle"]`)
    .clear()
    .type(name.middle);
  cy.get(`input[name="${baseName}_last"]`)
    .clear()
    .type(name.last);
  if (name.suffix) {
    cy.get(`input[name="${baseName}]_suffix`).select(name.suffix);
  }
});
