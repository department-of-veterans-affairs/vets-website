Cypress.Commands.add('keys', keys => {
  keys.forEach(key => {
    cy.realPress(key);
  });
});

Cypress.Commands.add('repeatKey', (key, multiple) => {
  for (let i = 0; i < multiple; i++) {
    cy.realPress(key);
  }
});
