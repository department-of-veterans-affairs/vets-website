import basicUser from './fixtures/users/user-basic.json';

describe('healthcare questionnaire list -- tabs ', () => {
  it('-- default to to do', () => {
    cy.fixture(
      '../../src/applications/healthcare/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.enabled.json',
    ).then(features => {
      cy.route('GET', '/v0/feature_toggles*', features);
      cy.login(basicUser);
      cy.visit('/healthcare/list');
      cy.get('#tabpanel_toDo').then(el => {
        expect(el).to.exist;
      });
    });
  });
  it('-- switch to completed tab', () => {
    cy.fixture(
      '../../src/applications/healthcare/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.enabled.json',
    ).then(features => {
      cy.route('GET', '/v0/feature_toggles*', features);
      cy.login(basicUser);
      cy.visit('/healthcare/list');
      cy.get('#tab_completed').click();
      cy.get('#tabpanel_completed').then(el => {
        expect(el).to.exist;
      });
    });
  });
  it('-- switch to todo tab', () => {
    cy.fixture(
      '../../src/applications/healthcare/questionnaire/tests/e2e/fixtures/mocks/feature-toggles.enabled.json',
    ).then(features => {
      cy.route('GET', '/v0/feature_toggles*', features);
      cy.login(basicUser);
      cy.visit('/healthcare/list');
      cy.get('#tab_toDo').click();
      cy.get('#tabpanel_toDo').then(el => {
        expect(el).to.exist;
      });
    });
  });
});
