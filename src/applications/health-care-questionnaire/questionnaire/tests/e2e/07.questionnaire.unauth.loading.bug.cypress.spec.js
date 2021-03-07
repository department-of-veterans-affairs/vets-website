import featureToggles from './fixtures/mocks/feature-toggles.enabled.json';

describe('health care questionnaire -- un-authenticated', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
  });
  it('-- redirects to log in', () => {
    cy.visit(
      '/health-care/health-questionnaires/questionnaires/answer-questions?id=195bc02c0518870fc6b1e302cfc326b61',
    );

    cy.url().should(
      'match',
      /next=%2Fhealth-care%2Fhealth-questionnaires%2Fquestionnaires/,
    );
  });
});
