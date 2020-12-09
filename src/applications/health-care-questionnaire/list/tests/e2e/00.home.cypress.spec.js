import basicUser from './fixtures/users/user-basic.json';

it('healthcare questionnaire list -- loads manager page -- feature enabled', () => {
  cy.fixture(
    '../../src/applications/health-care-questionnaire/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.enabled.json',
  ).then(features => {
    cy.route('GET', '/v0/feature_toggles*', features);
    cy.login(basicUser);
    cy.visit('/health-care/health-questionnaires/questionnaires/');
    cy.get('h1').contains('Your health questionnaires');
    cy.injectAxe();
    cy.axeCheck();
  });
});

it('healthcare questionnaire  list-- can not manager page -- feature disabled', () => {
  cy.fixture(
    '../../src/applications/health-care-questionnaire/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.disabled.json',
  ).then(features => {
    cy.route('GET', '/v0/feature_toggles*', features);
    const featureRoute = '/health-care/health-questionnaires/questionnaires/';
    cy.visit(featureRoute);
    cy.url().should('not.match', /healthcare/);
  });
});
