import basicUser from './fixtures/users/user-basic.js';

import featureToggles from './fixtures/mocks/feature-toggles.enabled.json';

describe('Health care questionnaire list -- ', () => {
  beforeEach(() => {
    cy.login(basicUser);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
    cy.window().then(window => {
      window.sessionStorage.removeItem('DISMISSED_DOWNTIME_WARNINGS');
      const data =
        '{"appointment":{"id":"I2-3PYJBEU2DIBW5RZT2XI3PASYGM7YYRD5TFQCLHQXK6YBXREQK5VQ0005","status":"booked","description":"Scheduled Visit","start":"2020-11-23T08:00:00Z","end":"2021-11-23T08:30:00Z","minutesDuration":30,"created":"2020-11-02","comment":"LS: 8/17/20, PID: 11/18/20","participant":[{"actor":{"reference":"https://sandbox-api.va.gov/services/fhir/v0/r4/Location/I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000","display":"TEM MH PSO TRS IND93EH 2"},"status":"accepted"},{"actor":{"reference":"https://sandbox-api.va.gov/services/fhir/v0/r4/Patient/1008882029V851792","display":"Mrs. Sheba703 Harris789"},"status":"accepted"}],"resourceType":"Appointment"},"organization":{"id":"I2-AKOTGEFSVKFJOPUKHIVJAH5VQU000000","identifier":[{"system":"http://hl7.org/fhir/sid/us-npi","value":"1205983228"},{"use":"usual","type":{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/v2-0203","code":"FI","display":"Facility ID"}],"text":"Facility ID"},"system":"https://api.va.gov/services/fhir/v0/r4/NamingSystem/va-facility-identifier","value":"vha_442"}],"active":true,"name":"NEW AMSTERDAM CBOC","telecom":[{"system":"phone","value":"800 555-7710"},{"system":"phone","value":"800 555-7720"},{"system":"phone","value":"800-555-7730"}],"address":[{"text":"10 MONROE AVE, SUITE 6B PO BOX 4160 NEW AMSTERDAM OH 44444-4160","line":["10 MONROE AVE, SUITE 6B","PO BOX 4160"],"city":"NEW AMSTERDAM","state":"OH","postalCode":"44444-4160"}],"resourceType":"Organization"},"location":{"id":"I2-3JYDMXC6RXTU4H25KRVXATSEJQ000000","identifier":[{"use":"usual","type":{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/v2-0203","code":"FI","display":"Facility ID"}],"text":"Facility ID"},"system":"https://api.va.gov/services/fhir/v0/r4/NamingSystem/va-facility-identifier","value":"vha_442"},{"system":"https://api.va.gov/services/fhir/v0/r4/NamingSystem/va-clinic-identifier","value":"vha_442_3049"}],"status":"active","name":"TEM MH PSO TRS IND93EH 2","description":"BLDG 146, RM W02","mode":"instance","type":[{"coding":[{"display":"Primary Care"}],"text":"Primary Care"}],"telecom":[{"system":"phone","value":"254-743-2867 x0002"}],"address":{"text":"1901 VETERANS MEMORIAL DRIVE TEMPLE TEXAS 76504","line":["1901 VETERANS MEMORIAL DRIVE"],"city":"TEMPLE","state":"TEXAS","postalCode":"76504"},"physicalType":{"coding":[{"display":"BLDG 146, RM W02"}],"text":"BLDG 146, RM W02"},"managingOrganization":{"reference":"https://sandbox-api.va.gov/services/fhir/v0/r4/Organization/I2-AKOTGEFSVKFJOPUKHIVJAH5VQU000000","display":"CHEYENNE VA MEDICAL"},"resourceType":"Location"},"questionnaire":[{"id":"7d93011b-29de-492a-b802-f6dc863c5c6b","title":"VA GOV Pre-Visit Agenda Questionnaire","questionnaireResponse":[{"id":"46f3cd5d-4731-4c61-a89d-f5c77a4c6ca1","status":"in-progress","submittedOn":"2021-03-13T14:37:13+00:00"}]}]}';
      window.sessionStorage.setItem(
        'health.care.questionnaire.selectedAppointmentData.I2-3PYJBEU2DIBW5RZT2XI3PASYGM7YYRD5TFQCLHQXK6YBXREQK5VQ0005',
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
      '/health-care/health-questionnaires/questionnaires/answer-questions/veteran-information?id=I2-3PYJBEU2DIBW5RZT2XI3PASYGM7YYRD5TFQCLHQXK6YBXREQK5VQ0005&skip',
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
      '/health-care/health-questionnaires/questionnaires/answer-questions/veteran-information?id=I2-3PYJBEU2DIBW5RZT2XI3PASYGM7YYRD5TFQCLHQXK6YBXREQK5VQ0005&skip',
    );
    cy.get('.usa-alert-heading').contains('This tool is down for maintenance.');
  });
});
