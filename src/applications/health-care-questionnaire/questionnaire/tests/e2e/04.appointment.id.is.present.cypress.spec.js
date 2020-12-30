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
  it('should show questionnaire with id in url', () => {
    cy.visit(
      '/health-care/health-questionnaires/questionnaires/answer-questions?id=1234',
    );
    cy.title().should('contain', 'Health care Questionnaire');
    cy.get('.schemaform-title>h1').contains(
      'Answer primary care questionnaire',
    );
  });
});
