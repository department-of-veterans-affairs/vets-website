import basicUser from './fixtures/users/user-basic.json';
import featuresEnabled from '../../../questionnaire/tests/e2e/fixtures/mocks/feature-toggles.enabled.json';
import featuresDisabled from '../../../questionnaire/tests/e2e/fixtures/mocks/feature-toggles.disabled.json';

it('health care questionnaire list -- loads manager page -- feature enabled', () => {
  cy.intercept('GET', '/v0/feature_toggles*', featuresEnabled);
  cy.login(basicUser);
  cy.visit('/health-care/health-questionnaires/questionnaires/');
  cy.get('h1').contains('Your health questionnaires');
  cy.injectAxe();
  cy.axeCheck();
});

it('health care questionnaire  list-- can not manager page -- feature disabled', () => {
  cy.intercept('GET', '/v0/feature_toggles*', featuresDisabled);
  const featureRoute = '/health-care/health-questionnaires/questionnaires/';
  cy.visit(featureRoute);
  cy.url().should('not.match', /health-care/);
});
