import basicUser from './fixtures/users/user-basic.js';

describe('healthcare questionnaire -- demographics -- addresses', () => {
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
  it('all default addresses', () => {
    cy.findByTestId('mailingAddress').contains(
      '1493 Martin Luther King Rd Apt 1',
      {
        matchCase: false,
      },
    );
    cy.findByTestId('residentialAddress').contains('PSC 808 Box 37', {
      matchCase: false,
    });
  });
});
