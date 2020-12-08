import basicUser from './fixtures/users/user-basic.json';

it('health care questionnaire list -- loads manager page -- bread crumbs exists', () => {
  cy.fixture(
    '../../src/applications/health-care-questionnaire/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.enabled.json',
  ).then(features => {
    cy.route('GET', '/v0/feature_toggles*', features);
    cy.login(basicUser);
    cy.visit('/health-care/health-questionnaires/questionnaires/');
    cy.get('#va-breadcrumbs-list')
      .children()
      .should('have.length', 3);
  });
});
