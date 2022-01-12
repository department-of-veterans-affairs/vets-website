import mockUser from './fixtures/mocks/mockUser';

describe('Application Status Test: HCA', () => {
  it('Achieves the correct result per URL', () => {
    cy.login(mockUser);
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
