import basicUser from '../fixtures/users/user-basic.js';

import featureToggles from '../fixtures/mocks/feature-toggles.enabled.json';

describe('health care questionnaire -- ', () => {
  beforeEach(() => {
    cy.login(basicUser);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
    cy.window().then(window => {
      const data =
        '{"appointment":{"id":"195bc02c0518870fc6b1e302cfc326b61","type":"va_appointments","attributes":{"startDate":"2020-08-26T15:00:00Z","sta6aid":"983","clinicId":"848","clinicFriendlyName":"CHY PC VAR2","facilityId":"983","communityCare":false,"patientIcn":"1013124304V115761","vdsAppointments":[{"bookingNotes":"Follow-up/Routine: testing reason for visit field availability","appointmentLength":"20","id":"848;20200826.090000","appointmentTime":"2021-02-26T15:00:00Z","clinic":{"name":"CHY PC VAR2","askForCheckIn":false,"facilityCode":"983","facility":{"displayName":"VDS Facility Primary Care Display Name"},"stopCode":"323"},"type":"REGULAR","currentStatus":"FUTURE"}],"vvsAppointments":[]}},"questionnaire":[{"id":"questionnnaire-ABC-123","questionnaireResponse":{"id":"response-123","status":"in-progress"}}]}';
      window.sessionStorage.setItem(
        'health.care.questionnaire.selectedAppointmentData.195bc02c0518870fc6b1e302cfc326b61',
        data,
      );
    });
  });
  it('loads introduction page -- feature enabled', () => {
    cy.visit(
      '/health-care/health-questionnaires/questionnaires/answer-questions?id=195bc02c0518870fc6b1e302cfc326b61',
    );
    cy.get('h2.help-heading').contains('Need help?');
  });
});
