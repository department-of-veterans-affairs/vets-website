import basicUser from './fixtures/users/user-basic.json';

describe('Health care questionnaire list -- ', () => {
  it('Testing that downtime is shown.', () => {
    cy.fixture(
      '../../src/applications/health-care-questionnaire/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.enabled.json',
    ).then(features => {
      cy.intercept('GET', '/v0/feature_toggles*', features);
      cy.login(basicUser);
      cy.visit('/health-care/health-questionnaires/questionnaires/');
      cy.get('h1').contains('Your health questionnaires');
    });
  });
});
