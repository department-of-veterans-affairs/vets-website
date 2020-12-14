import basicUser from './fixtures/users/user-basic.js';

it('healthcare questionnaire -- loads introduction page -- feature enabled', () => {
  cy.fixture(
    '../../src/applications/healthcare/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.enabled.json',
  ).then(features => {
    cy.route('GET', '/v0/feature_toggles*', features);
    cy.login(basicUser);
    cy.visit(
      '/health-care/health-questionnaires/questionnaires/answer-questions/introduction',
    );
    cy.title().should('contain', 'Health care Questionnaire');
    cy.get('.schemaform-title>h1').contains(
      'Answer primary care questionnaire',
    );
  });
});

it('healthcare questionnaire -- can not see feature -- feature disabled', () => {
  cy.fixture(
    '../../src/applications/healthcare/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.disabled.json',
  ).then(features => {
    cy.route('GET', '/v0/feature_toggles*', features);
    const featureRoute =
      '/health-care/health-questionnaires/questionnaires/answer-questions/introduction';
    cy.visit(featureRoute);

    cy.url().should('not.match', /health-care/);
  });
});
