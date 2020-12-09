import basicUser from './fixtures/users/user-basic.js';

describe('healthcare questionnaire -- demographics -- basic information', () => {
  beforeEach(() => {
    cy.fixture(
      '../../src/applications/health-care-questionnaire/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.enabled.json',
    ).then(async features => {
      cy.route('GET', '/v0/feature_toggles*', features);
      cy.login(basicUser);
      window.localStorage.setItem(
        'DISMISSED_ANNOUNCEMENTS',
        JSON.stringify(['single-sign-on-intro']),
      );
      cy.visit(
        '/health-care/health-questionnaires/questionnaires/answer-questions/demographics?skip',
      );
    });
  });

  it('basic information', () => {
    cy.findByTestId('fullName').contains('Calvin C Fletcher', {
      matchCase: true,
    });
    cy.findByTestId('dateOfBirth').contains('December 19, 1924', {
      matchCase: false,
    });
    cy.findByTestId('gender').contains('male', {
      matchCase: false,
    });
  });
});
