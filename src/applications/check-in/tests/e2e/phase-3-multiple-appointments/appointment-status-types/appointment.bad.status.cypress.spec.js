import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import '../../support/commands';
import Timeouts from 'platform/testing/e2e/timeouts';

describe('Check In Experience -- ', () => {
  describe('phase 3 -- ', () => {
    beforeEach(function() {
      cy.authenticate();
      const appointments = [{ eligibility: 'INELIGIBLE_BAD_STATUS' }];
      cy.getAppointments(appointments);
      cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles({}));
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Appointment shows bad status', () => {
      cy.visitWithUUID();
      cy.get('h1').contains('Check in at VA');
      cy.injectAxe();
      cy.axeCheck();
      cy.signIn();
      cy.get('.appointment-list > li p', { timeout: Timeouts.slow }).should(
        'contain',
        'Online check-in isn’t available for this appointment. Check in with a staff member.',
      );
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
