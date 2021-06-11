const Timeouts = require('platform/testing/e2e/timeouts');

Cypress.Commands.add('testUnauthedUserFlow', path => {
  cy.visit(path);
  cy.get('body', { timeout: Timeouts.normal }).should('be.visible');
  cy.get('.login', { timeout: Timeouts.normal })
    .should('be.visible')
    .then(loginElement => {
      cy.wrap(loginElement).should('match', 'h1');
      cy.wrap(loginElement).should('contain', 'Sign in to VA.gov');
    });
});
