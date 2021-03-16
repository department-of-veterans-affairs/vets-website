import basicUser from './fixtures/users/user-basic.json';

import featureToggles from '../../../questionnaire/tests/e2e/fixtures/mocks/feature-toggles.enabled.json';

describe('Health care questionnaire list -- ', () => {
  beforeEach(() => {
    cy.login(basicUser);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
    cy.window().then(win => {
      win.sessionStorage.removeItem('DISMISSED_DOWNTIME_WARNINGS');
    });
  });
  it.skip('upcoming maintenance', () => {
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
    cy.visit('/health-care/health-questionnaires/questionnaires/');
    cy.get('h1').contains('Your health questionnaires');

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
    cy.visit('/health-care/health-questionnaires/questionnaires/');
    cy.get('.usa-alert-heading').contains('This tool is down for maintenance.');
  });
});
