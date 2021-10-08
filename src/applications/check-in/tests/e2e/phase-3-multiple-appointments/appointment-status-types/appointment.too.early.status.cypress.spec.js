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
        const earlyStatusWithStart = mockPatientCheckIns.createAppointment();
        earlyStatusWithStart.eligibility = 'INELIGIBLE_TOO_EARLY';
        earlyStatusWithStart.startTime = '2021-08-19T12:00:00';
        earlyStatusWithStart.checkInWindowStart = '2021-08-19T11:00:00';
        const earlyStatusWithoutStart = mockPatientCheckIns.createAppointment();
        earlyStatusWithoutStart.eligibility = 'INELIGIBLE_TOO_EARLY';
        earlyStatusWithoutStart.startTime = '2021-08-19T14:00:00';
        earlyStatusWithoutStart.checkInWindowStart = undefined;
        const response = {
          payload: {
            appointments: [earlyStatusWithStart, earlyStatusWithoutStart],
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
    it('Appointment shows early status with time and without', () => {
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
        'You can check in starting at this time: 11:00 a.m.',
      );
      cy.get('.appointment-list li:nth-child(2) p', {
        timeout: Timeouts.slow,
      }).should(
        'contain',
        'This appointment isn’t eligible for online check-in. Check-in with a staff member.',
      );
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
