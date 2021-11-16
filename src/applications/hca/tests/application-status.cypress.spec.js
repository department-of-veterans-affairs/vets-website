import Timeouts from 'platform/testing/e2e/timeouts';
import mockUser from './fixtures/mocks/mockUser';

Cypress.Commands.add('testStatus', (page, url) => {
  cy.visit(page);
  cy.get('.sip-application-status').should('be.visible', {
    timeout: Timeouts.slow,
  });
  cy.injectAxeThenAxeCheck();

  cy.get('main a.usa-button-primary').should('have.attr', 'href', url);

  cy.get('.usa-button-secondary')
    .should('exist')
    .then(button => {
      cy.wrap(button).click();
    });
  cy.get('#start-over-modal-title').should(
    'contain',
    'Starting over will delete your in-progress application.',
  );
  cy.axeCheck();
});

describe('Application Status Test', () => {
  it('Achieves the correct result per URL', () => {
    cy.login();
    cy.intercept('GET', '/v0/user', mockUser);
    cy.testStatus(
      '/health-care/how-to-apply/',
      '/health-care/apply/application/resume',
    );
    cy.testStatus(
      '/health-care/eligibility',
      '/health-care/apply/application/resume',
    );
  });
});
