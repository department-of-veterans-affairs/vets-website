import mockUser from './fixtures/mocks/mockUser';

describe('Application Status Test: edu-benefits', () => {
  it('Achieves the correct result per URL', () => {
    cy.login(mockUser);
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
