/* eslint-disable va/axe-check-required */
// AXE checks already in hca.cypress.spec.js
import mockUser from './fixtures/mockUser';

describe('Application Status Test: HCA', () => {
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
/* eslint-enable va/axe-check-required */
