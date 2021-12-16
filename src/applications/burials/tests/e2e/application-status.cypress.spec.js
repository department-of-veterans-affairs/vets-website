import mockUser from './fixtures/mocks/mockUser';

describe('Application Status Test: Burials and Memorials', () => {
  it('Achieves the correct result per URL', () => {
    cy.login();
    cy.intercept('GET', '/v0/user', mockUser);
    cy.testStatus(
      '/burials-memorials/veterans-burial-allowance/',
      '/burials-and-memorials/application/530/resume',
    );
  });
});
