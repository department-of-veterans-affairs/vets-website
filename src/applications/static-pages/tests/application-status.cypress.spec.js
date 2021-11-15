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

    // src/applications/hca @department-of-veterans-affairs/vsa-caregiver-frontend @department-of-veterans-affairs/vsa-bam-1-frontend
    cy.testStatus(
      '/health-care/how-to-apply/',
      '/health-care/apply/application/resume',
    );
    cy.testStatus(
      '/health-care/eligibility',
      '/health-care/apply/application/resume',
    );

    // ???
    cy.testStatus(
      '/pension/how-to-apply/',
      '/pension/application/527EZ/resume',
    );
    cy.testStatus('/pension/eligibility', '/pension/application/527EZ/resume');

    // src/applications/burials @department-of-veterans-affairs/vsa-debt-frontend @department-of-veterans-affairs/vsa-bam-1-frontend
    cy.testStatus(
      '/burials-memorials/veterans-burial-allowance/',
      '/burials-and-memorials/application/530/resume',
    );

    // src/applications/my-education-benefits @department-of-veterans-affairs/my-education-benefits
    cy.testStatus(
      '/education/how-to-apply/',
      '/education/apply-for-education-benefits/application/1995/resume',
    );
    cy.testStatus(
      '/education/eligibility',
      '/education/apply-for-education-benefits/application/1995/resume',
    );
  });
});
