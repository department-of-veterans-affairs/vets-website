import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import '../../support/commands';
import Timeouts from 'platform/testing/e2e/timeouts';

describe('Check In Experience -- ', () => {
  describe('phase 3 -- ', () => {
    beforeEach(function() {
      cy.authenticate();
      const appointments = [
        {
          eligibility: 'INELIGIBLE_TOO_EARLY',
          startTime: '2021-08-19T12:00:00',
          checkInWindowStart: '2021-08-19T11:00:00',
        },
        {
          eligibility: 'INELIGIBLE_TOO_EARLY',
          startTime: '2021-08-19T14:00:00',
          checkInWindowStart: undefined,
        },
      ];
      cy.getAppointments(appointments);
      cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles({}));
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
      cy.signIn();
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
