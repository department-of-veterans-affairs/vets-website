import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import basicUser from './fixtures/users/user-basic.js';
import featureToggles from './fixtures/mocks/feature-toggles.enabled.json';

describe('health care questionnaire -- appointment id is required --', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
    cy.window().then(win => win.sessionStorage.clear());
    cy.login(basicUser);
    disableFTUXModals();
  });

  it('should redirect without id in url ', () => {
    cy.visit(
      '/health-care/health-questionnaires/questionnaires/answer-questions/introduction',
    );
    cy.get('h1').contains('Your health questionnaires');
  });
});
