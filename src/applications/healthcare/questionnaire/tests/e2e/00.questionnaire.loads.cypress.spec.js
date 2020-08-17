const Timeouts = require('platform/testing/e2e/timeouts.js');

it('healthcare questionnaire -- loads introduction page -- feature enabled', () => {
  cy.fixture(
    '../../src/applications/healthcare/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.enabled.json',
  ).then(features => {
    cy.route('GET', '/v0/feature_toggles*', features);
    cy.visit('/healthcare/questionnaire/introduction');
    cy.title().should('contain', 'Healthcare Questionnaire');
    cy.get('.schemaform-title>h1', { timeout: Timeouts.normal }).contains(
      'Healthcare Questionnaire',
    );
  });
});

it('healthcare questionnaire -- can not see feature -- feature disabled', () => {
  cy.fixture(
    '../../src/applications/healthcare/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.disabled.json',
  ).then(features => {
    cy.route('GET', '/v0/feature_toggles*', features);
    const feautureRoute = '/healthcare/questionnaire/introduction';
    cy.visit(feautureRoute);

    cy.url().should('not.match', /healthcare/);
  });
});
