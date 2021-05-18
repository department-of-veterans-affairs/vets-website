// implemented our own injectAxe function
// cy.injectAxe() was causing a require not defined error from cypress-axe https://github.com/component-driven/cypress-axe/issues/82

Cypress.Commands.overwrite('injectAxe', () => {
  cy.readFile('node_modules/axe-core/axe.min.js').then(source => {
    return cy.window({ log: false }).then(window => {
      window.eval(source);
    });
  });
});
