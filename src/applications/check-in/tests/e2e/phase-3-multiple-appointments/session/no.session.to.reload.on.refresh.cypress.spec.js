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
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });

  it('C5751 - Should show error page since there is no data to load locally', () => {
    const featureRoute = '/health-care/appointment-check-in/update-information';
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
    cy.visit(featureRoute);
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('contain', 'We couldn’t check you in');
  });
});
