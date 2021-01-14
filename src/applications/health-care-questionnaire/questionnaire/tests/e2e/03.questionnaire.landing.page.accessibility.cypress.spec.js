import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import basicUser from './fixtures/users/user-basic.js';

describe('health care questionnaire -- landing page --', () => {
  beforeEach(() => {
    cy.fixture(
      '../../src/applications/health-care-questionnaire/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.enabled.json',
    ).then(async features => {
      cy.route('GET', '/v0/feature_toggles*', features);
      cy.login(basicUser);
      disableFTUXModals();
      cy.visit(
        '/health-care/health-questionnaires/questionnaires/answer-questions/introduction?id=12345&skip',
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
