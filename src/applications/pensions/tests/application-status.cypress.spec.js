import mockUser from './fixtures/mocks/mockUser';

describe('Application Status Test: Pensions', () => {
  it('Achieves the correct result per URL', () => {
    cy.login(mockUser);

    cy.testStatus(
      '/pension/how-to-apply/',
      '/pension/application/527EZ/resume',
    );
    cy.testStatus('/pension/eligibility', '/pension/application/527EZ/resume');
  });
});
