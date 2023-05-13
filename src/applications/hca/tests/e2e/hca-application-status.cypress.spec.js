import mockUser from './fixtures/mocks/mockUserAppStatus';

describe('HCA-Application-Status-Test', () => {
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

    cy.injectAxe();
    cy.axeCheck();
  });
});
