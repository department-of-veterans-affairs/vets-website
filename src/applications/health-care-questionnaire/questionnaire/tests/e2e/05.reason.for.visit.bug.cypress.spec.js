import basicUser from './fixtures/users/user-basic.js';

it('health care questionnaire -- reason for visit -- can be cleared', () => {
  cy.fixture(
    '../../src/applications/health-care-questionnaire/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.enabled.json',
  ).then(features => {
    cy.route('GET', '/v0/feature_toggles*', features);
    cy.login(basicUser);
    cy.visit(
      '/health-care/health-questionnaires/questionnaires/answer-questions?id=195bc02c0518870fc6b1e302cfc326b65',
    );
    cy.title().should('contain', 'Health care Questionnaire');
    cy.get('.schemaform-title>h1').contains(
      'Answer primary care questionnaire',
    );
    cy.get('.va-button').click();
    cy.get('#2-continueButton').click();
    cy.get('#root_reasonForVisitDescription').clear();
    cy.get('#root_reasonForVisitDescription').should('be.empty');
  });
});
