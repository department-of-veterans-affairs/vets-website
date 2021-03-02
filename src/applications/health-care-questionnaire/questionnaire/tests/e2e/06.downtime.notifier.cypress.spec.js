import basicUser from './fixtures/users/user-basic.js';

import featureToggles from './fixtures/mocks/feature-toggles.enabled.json';

describe('Health care questionnaire list -- ', () => {
  beforeEach(() => {
    cy.login(basicUser);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
    cy.window().then(window => {
      window.sessionStorage.removeItem('DISMISSED_DOWNTIME_WARNINGS');
      const data =
        '{"appointment":{"id":"195bc02c0518870fc6b1e302cfc326b61","type":"va_appointments","attributes":{"startDate":"2020-08-26T15:00:00Z","sta6aid":"983","clinicId":"848","clinicFriendlyName":"CHY PC VAR2","facilityId":"983","communityCare":false,"patientIcn":"1013124304V115761","vdsAppointments":[{"bookingNotes":"Follow-up/Routine: testing reason for visit field availability","appointmentLength":"20","id":"848;20200826.090000","appointmentTime":"2021-12-14T15:00:00Z","clinic":{"name":"CHY PC VAR2","askForCheckIn":false,"facilityCode":"983","facility":{"displayName":"VDS Facility Primary Care Display Name"},"stopCode":"323"},"type":"REGULAR","currentStatus":"FUTURE"}],"vvsAppointments":[]}},"questionnaire":[{"id":"questionnnaire-ABC-123","questionnaireResponse":{"id":"response-123","status":"in-progress"}}]}';
      window.sessionStorage.setItem(
        'health.care.questionnaire.selectedAppointmentData.195bc02c0518870fc6b1e302cfc326b61',
        data,
      );
    });
  });
  it('upcoming maintenance', () => {
    // start time is one minute from now
    const startTime = new Date(Date.now() + 60 * 1000);
    // end time is one hour from now
    const endTime = new Date(Date.now() + 60 * 60 * 1000);
    // need to use route in the test, to overwrite the
    // route being added in `vets-website/src/platform/testing/e2e/cypress/support/index.js`
    // github link `https://github.com/department-of-veterans-affairs/vets-website/blob/0e1e0f3caa19fb2b2b5c4be3ed93523857c10060/src/platform/testing/e2e/cypress/support/index.js#L39-L41`
    cy.route('GET', '/v0/maintenance_windows', {
      data: [
        {
          id: '1',
          type: 'maintenance_windows',
          attributes: {
            externalService: 'hcq',
            // toISOString() matches the format used by the real API, '2021-02-14T02:00:00.000Z'
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            description: '',
          },
        },
      ],
    });
    cy.visit(
      '/health-care/health-questionnaires/questionnaires/answer-questions?id=195bc02c0518870fc6b1e302cfc326b61&skip',
    );
    cy.get('.schemaform-title>h1').contains(
      'Answer primary care questionnaire',
    );

    cy.get('.downtime-notification').then(el => {
      expect(el).to.exist;
      cy.get('.downtime-notification h3').contains(
        'The health questionnaire will be down for maintenance soon',
      );
    });
  });
  it('currently in maintenance', () => {
    // start time is one minute from now
    const startTime = new Date(Date.now() - 60 * 1000);
    // end time is one hour from now
    const endTime = new Date(Date.now() + 60 * 60 * 1000);
    // need to use route in the test, to overwrite the
    // route being added in `vets-website/src/platform/testing/e2e/cypress/support/index.js`
    // github link `https://github.com/department-of-veterans-affairs/vets-website/blob/0e1e0f3caa19fb2b2b5c4be3ed93523857c10060/src/platform/testing/e2e/cypress/support/index.js#L39-L41`
    cy.route('GET', '/v0/maintenance_windows', {
      data: [
        {
          id: '1',
          type: 'maintenance_windows',
          attributes: {
            externalService: 'hcq',
            // toISOString() matches the format used by the real API, '2021-02-14T02:00:00.000Z'
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            description: '',
          },
        },
      ],
    });
    cy.visit(
      '/health-care/health-questionnaires/questionnaires/answer-questions?id=195bc02c0518870fc6b1e302cfc326b61&skip',
    );
    cy.get('.usa-alert-heading').contains('This tool is down for maintenance.');
  });
});
