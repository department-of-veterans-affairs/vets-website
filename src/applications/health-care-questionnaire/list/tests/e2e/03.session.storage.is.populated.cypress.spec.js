import basicUser from './fixtures/users/user-basic.json';

import featureToggles from './fixtures/mocks/feature-toggles.enabled.json';

import selectedAppointment from '../../../shared/api/mock-data/fhir/upcoming.appointment.in.progress.primary.care.questionnaire.json';

describe('health care questionnaire list -- ', () => {
  beforeEach(() => {
    cy.login(basicUser);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
  });
  it('manager and questionnaire integration -- exists', () => {
    cy.visit('/health-care/health-questionnaires/questionnaires/');
    cy.get('h1').contains('Your health questionnaires');
    cy.get(
      '[data-request-id="I2-3PYJBEU2DIBW5RZT2XI3PASYGM7YYRD5TFQCLHQXK6YBXREQK5VQ0005"] > .usa-button',
    ).click({ waitForAnimations: true });
    cy.window().then(window => {
      const data = window.sessionStorage.getItem(
        'health.care.questionnaire.selectedAppointmentData.I2-3PYJBEU2DIBW5RZT2XI3PASYGM7YYRD5TFQCLHQXK6YBXREQK5VQ0005',
      );
      const sample = JSON.stringify(selectedAppointment);
      expect(data).to.equal(sample);
    });
  });
});
