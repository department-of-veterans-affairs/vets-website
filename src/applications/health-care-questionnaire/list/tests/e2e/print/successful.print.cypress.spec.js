import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';

import basicUser from '../fixtures/users/user-basic.json';
import featureToggles from '../fixtures/mocks/feature-toggles.enabled.json';

describe('health care questionnaire list -- printing', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
    cy.intercept('/health_quest/v0/questionnaire_manager/**', req => {
      req.headers['Content-Type'] = 'application/pdf';
      req.reply('data');
    });
    cy.login(basicUser);
    disableFTUXModals();
  });

  it('successful print', () => {
    cy.visit('/health-care/health-questionnaires/questionnaires/');
    cy.get('h1').contains('Your health questionnaires');
    cy.get('#tab_completed').click();
    cy.get(
      '[data-request-id="I2-3PYJBEU2DIBW5RZT2XI3PASYGM7YYRD5TFQCLHQXK6YBXREQK5VQ0001"] > [data-testid=print-button]',
    ).click();
  });
});
