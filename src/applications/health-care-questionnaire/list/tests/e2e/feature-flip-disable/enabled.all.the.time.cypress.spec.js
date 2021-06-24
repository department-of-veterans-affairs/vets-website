import basicUser from '../fixtures/users/user-basic.json';

describe('health care questionnaire list -- ', () => {
  it('loads if feature flip never returns', () => {
    cy.intercept('GET', '/v0/feature_toggles*', _req => {});
    cy.login(basicUser);
    cy.visit('/health-care/health-questionnaires/questionnaires/');
    cy.get('h1').contains('Your health questionnaires');
    cy.injectAxe();
    cy.axeCheck();
  });
});
