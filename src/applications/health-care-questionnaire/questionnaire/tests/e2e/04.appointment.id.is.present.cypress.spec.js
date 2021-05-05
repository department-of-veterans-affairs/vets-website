import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import basicUser from './fixtures/users/user-basic.js';
import featureToggles from './fixtures/mocks/feature-toggles.enabled.json';

import { setSessionStorage } from '../../../shared/test-data/e2e/session.storage.mock';

describe('health care questionnaire -- appointment id is required --', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
    cy.login(basicUser);
    disableFTUXModals();
    cy.window().then(window => {
      const apptId =
        'I2-3PYJBEU2DIBW5RZT2XI3PASYGM7YYRD5TFQCLHQXK6YBXREQK5VQ0005';
      setSessionStorage(window, apptId);

      cy.visit(
        `/health-care/health-questionnaires/questionnaires/answer-questions?id=${apptId}`,
      );
    });
  });

  it('should show questionnaire with id in url', () => {
    cy.title().should('contain', 'Health care Questionnaire');
    cy.get('.schemaform-title>h1').contains(
      'Answer primary care questionnaire',
    );
  });
});
