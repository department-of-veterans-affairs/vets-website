import basicUser from './fixtures/users/user-basic.js';

describe('healthcare questionnaire -- landing page --', () => {
  beforeEach(() => {
    cy.fixture(
      '../../src/applications/healthcare/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.enabled.json',
    ).then(async features => {
      cy.route('GET', '/v0/feature_toggles*', features);
      cy.login(basicUser);
      window.localStorage.setItem(
        'DISMISSED_ANNOUNCEMENTS',
        JSON.stringify(['single-sign-on-intro']),
      );
      cy.visit(
        '/health-care/health-questionnaires/questionnaires/answer-questions/introduction?skip',
      );
    });
  });
  it('accessibility', () => {
    cy.get('.schemaform-title>h1').contains(
      'Answer primary care questionnaire',
    );
    cy.injectAxe();
    cy.axeCheck();
  });
});
