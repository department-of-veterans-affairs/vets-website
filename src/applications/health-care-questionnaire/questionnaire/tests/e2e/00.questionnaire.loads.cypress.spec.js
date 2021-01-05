import basicUser from './fixtures/users/user-basic.js';

it('health care questionnaire -- loads introduction page -- feature enabled', () => {
  cy.fixture(
    '../../src/applications/health-care-questionnaire/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.enabled.json',
  ).then(features => {
    cy.route('GET', '/v0/feature_toggles*', features);
    cy.login(basicUser);
    cy.visit(
      '/health-care/health-questionnaires/questionnaires/answer-questions?id=1234',
    );
    cy.title().should('contain', 'Health care Questionnaire');
    cy.get('.schemaform-title>h1').contains(
      'Answer primary care questionnaire',
    );
  });
});

it('health care questionnaire -- can not see feature -- feature disabled', () => {
  cy.fixture(
    '../../src/applications/health-care-questionnaire/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.disabled.json',
  ).then(features => {
    cy.route('GET', '/v0/feature_toggles*', features);
    const featureRoute =
      '/health-care/health-questionnaires/questionnaires/answer-questions?id=1234';
    cy.visit(featureRoute);

    cy.url().should('not.match', /health-care/);
  });
});
