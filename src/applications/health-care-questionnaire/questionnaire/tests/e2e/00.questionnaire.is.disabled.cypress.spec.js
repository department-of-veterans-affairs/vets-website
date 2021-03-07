import basicUser from './fixtures/users/user-basic.js';

import featureToggles from './fixtures/mocks/feature-toggles.disabled.json';

describe('health care questionnaire -- ', () => {
  beforeEach(() => {
    cy.login(basicUser);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
  });
  it('can not see feature -- feature disabled', () => {
    const featureRoute =
      '/health-care/health-questionnaires/questionnaires/answer-questions?id=195bc02c0518870fc6b1e302cfc326b61';
    cy.visit(featureRoute);
    cy.url().should('not.match', /health-care/);
  });
});
