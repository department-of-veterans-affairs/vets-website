import featureToggles from '../fixtures/mocks/feature-toggles.disabled.json';

describe('health care questionnaire -- feature disabled ', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
  });
  it('loads introduction page -- feature enabled', () => {
    cy.visit(
      '/health-care/health-questionnaires/questionnaires/answer-questions',
    );
    cy.url().should('not.match', /health-care/);
  });
});
