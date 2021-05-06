import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import basicUser from './fixtures/users/user-basic.js';
import featureToggles from './fixtures/mocks/feature-toggles.enabled.json';

import { setSessionStorage } from '../../../shared/test-data/e2e/session.storage.mock';

describe('health care questionnaire -- reason for visit --', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
    cy.login(basicUser);
    disableFTUXModals();
    cy.window().then(window => {
      const apptId =
        'I2-3PYJBEU2DIBW5RZT2XI3PASYGM7YYRD5TFQCLHQXK6YBXREQK5VQ0005';
      setSessionStorage(window, apptId);
      cy.visit(
        `/health-care/health-questionnaires/questionnaires/answer-questions?id=${apptId}&skip`,
      );
    });
  });

  it('can be cleared', () => {
    cy.title().should('contain', 'Health care Questionnaire');
    cy.get('.schemaform-title>h1').contains(
      'Answer primary care questionnaire',
    );
    cy.get('.vads-c-action-link--green').click({ waitForAnimations: true });
    cy.login(basicUser);

    cy.get('#2-continueButton').click({ waitForAnimations: true });
    cy.login(basicUser);

    cy.get('#root_reasonForVisitDescription').clear();
    cy.get('#root_reasonForVisitDescription').should('be.empty');
  });
});
