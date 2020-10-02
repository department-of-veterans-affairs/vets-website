import basicUser from './fixtures/users/user-basic.json';

it('healthcare questionnaire -- loads introduction page -- feature enabled', () => {
  cy.fixture(
    '../../src/applications/healthcare/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.enabled.json',
  ).then(features => {
    cy.route('GET', '/v0/feature_toggles*', features);
    cy.login(basicUser);
    cy.visit('/healthcare/questionnaire/introduction');
    cy.title().should('contain', 'Healthcare Questionnaire');
    cy.get('.schemaform-title>h1').contains(
      'Upcoming appointment questionnaire',
    );
  });
});

it('healthcare questionnaire -- can not see feature -- feature disabled', () => {
  cy.fixture(
    '../../src/applications/healthcare/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.disabled.json',
  ).then(features => {
    cy.route('GET', '/v0/feature_toggles*', features);
    const featureRoute = '/healthcare/questionnaire/introduction';
    cy.visit(featureRoute);

    cy.url().should('not.match', /healthcare/);
  });
});
