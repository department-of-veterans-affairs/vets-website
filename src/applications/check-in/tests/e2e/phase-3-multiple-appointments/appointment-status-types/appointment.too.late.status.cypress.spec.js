import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import mockSession from '../../../../api/local-mock-api/mocks/v2/sessions.responses';
import mockPatientCheckIns from '../../../../api/local-mock-api/mocks/v2/patient.check.in.responses';
import Timeouts from 'platform/testing/e2e/timeouts';

describe('Check In Experience -- ', () => {
  describe('phase 3 -- ', () => {
    beforeEach(function() {
      cy.intercept('GET', '/check_in/v2/sessions/*', req => {
        req.reply(
          mockSession.createMockSuccessResponse('some-token', 'read.basic'),
        );
      });
      cy.intercept('POST', '/check_in/v2/sessions', req => {
        req.reply(
          mockSession.createMockSuccessResponse('some-token', 'read.full'),
        );
      });
      cy.intercept('GET', '/check_in/v2/patient_check_ins/*', req => {
        const lateStatus = mockPatientCheckIns.createAppointment();
        lateStatus.eligibility = 'INELIGIBLE_TOO_LATE';
        const response = {
          payload: {
            appointments: [lateStatus],
          },
        };
        req.reply(response);
      });
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles(true, true, true, false),
      );
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Appointment shows late status', () => {
      const featureRoute =
        '/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
      cy.visit(featureRoute);
      cy.get('h1').contains('Check in at VA');
      cy.injectAxe();
      cy.axeCheck();
      cy.get('[label="Your last name"]')
        .shadow()
        .find('input')
        .type('Smith');
      cy.get('[label="Last 4 digits of your Social Security number"]')
        .shadow()
        .find('input')
        .type('4837');
      cy.get('[data-testid=check-in-button]').click();
      cy.get('.appointment-list > li p', { timeout: Timeouts.slow }).should(
        'contain',
        'Your appointment started more than 10 minutes ago. We can’t check you in online. Ask a staff member for help.',
      );
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
