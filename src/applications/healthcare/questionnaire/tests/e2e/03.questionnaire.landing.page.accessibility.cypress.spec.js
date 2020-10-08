import basicUser from './fixtures/users/user-basic.json';

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
      cy.visit('/healthcare/questionnaire/introduction?skip');
    });
  });
  it('accessibility', () => {
    cy.get('.schemaform-title>h1').contains(
      'Upcoming appointment questionnaire',
    );
    cy.injectAxe();
    cy.axeCheck();
  });
});
