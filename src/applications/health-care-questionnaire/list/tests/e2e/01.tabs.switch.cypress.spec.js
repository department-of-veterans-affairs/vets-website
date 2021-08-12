import basicUser from './fixtures/users/user-basic.json';
import features from '../../../questionnaire/tests/e2e/fixtures/mocks/feature-toggles.enabled.json';

describe('health care questionnaire list -- tabs ', () => {
  it('-- default to to do', () => {
    cy.intercept('GET', '/v0/feature_toggles*', features);
    cy.login(basicUser);
    cy.visit('/health-care/health-questionnaires/questionnaires/');
    cy.get('#tabpanel_toDo').then(el => {
      expect(el).to.exist;
    });
  });
  it('-- switch to completed tab', () => {
    cy.intercept('GET', '/v0/feature_toggles*', features);
    cy.login(basicUser);
    cy.visit('/health-care/health-questionnaires/questionnaires/');
    cy.get('#tab_completed').click({ waitForAnimations: true });
    cy.get('#tabpanel_completed').then(el => {
      expect(el).to.exist;
    });
  });
  it('-- switch to todo tab', () => {
    cy.intercept('GET', '/v0/feature_toggles*', features);
    cy.login(basicUser);
    cy.visit('/health-care/health-questionnaires/questionnaires/');
    cy.get('#tab_toDo').click({ waitForAnimations: true });
    cy.get('#tabpanel_toDo').then(el => {
      expect(el).to.exist;
      cy.url().should('match', /to-do/);
    });
  });
});
