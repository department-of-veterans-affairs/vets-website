import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import basicUser from './fixtures/users/user-basic.js';

describe('health care questionnaire -- appointment id is required --', () => {
  beforeEach(() => {
    cy.fixture(
      '../../src/applications/health-care-questionnaire/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.enabled.json',
    ).then(async features => {
      cy.route('GET', '/v0/feature_toggles*', features);
      cy.login(basicUser);
      disableFTUXModals();
    });
  });
  it('should redirect without id in url ', () => {
    cy.visit(
      '/health-care/health-questionnaires/questionnaires/answer-questions/introduction',
    );
    cy.get('h1').contains('Your health questionnaires');
  });
});
