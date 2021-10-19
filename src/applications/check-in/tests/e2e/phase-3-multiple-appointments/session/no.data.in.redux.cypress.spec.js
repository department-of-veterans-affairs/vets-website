import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';

import mockCheckIn from '../../../../api/local-mock-api/mocks/v2/check.in.responses';
import mockSession from '../../../../api/local-mock-api/mocks/v2/sessions.responses';
import mockPatientCheckIns from '../../../../api/local-mock-api/mocks/v2/patient.check.in.responses';
import Timeouts from 'platform/testing/e2e/timeouts';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    let hasValidated = false;
    cy.intercept('GET', '/check_in/v2/sessions/*', req => {
      req.reply(
        mockSession.createMockSuccessResponse('some-token', 'read.basic'),
      );
    });
    cy.intercept('POST', '/check_in/v2/sessions', req => {
      hasValidated = true;
      req.reply(
        mockSession.createMockSuccessResponse('some-token', 'read.full'),
      );
    });
    cy.intercept('GET', '/check_in/v2/patient_check_ins/*', req => {
      req.reply(
        mockPatientCheckIns.createMockSuccessResponse({}, hasValidated),
      );
    });
    cy.intercept('POST', '/check_in/v2/patient_check_ins/', req => {
      req.reply(mockCheckIn.createMockSuccessResponse({}));
    });
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        checkInExperienceMultipleAppointmentSupport: true,
        checkInExperienceUpdateInformationPageEnabled: false,
      }),
    );
    cy.window().then(window => {
      const sample = JSON.stringify({
        token: '46bebc0a-b99c-464f-a5c5-560bc9eae287',
      });
      window.sessionStorage.setItem(
        'health.care.check-in.current.uuid',
        sample,
      );
    });
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('C5749 - On page reload, the data should be pull from session storage and redirected to landing screen with data loaded', () => {
    const featureRoute = '/health-care/appointment-check-in/details';
    cy.visit(featureRoute);
    // redirected back to landing page to reload the data
    cy.url().should('match', /verify/);
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Check in at VA');
  });
});
