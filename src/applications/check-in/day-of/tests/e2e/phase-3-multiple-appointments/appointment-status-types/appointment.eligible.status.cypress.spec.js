import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import '../../support/commands';
import Timeouts from 'platform/testing/e2e/timeouts';

describe('Check In Experience -- ', () => {
  describe('phase 3 -- ', () => {
    beforeEach(function() {
      cy.authenticate();
      const appointments = [{ eligibility: 'ELIGIBLE' }];
      cy.getAppointments(appointments);
      cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles({}));
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Appointment is eligible for checkin and button is present.', () => {
      cy.visitWithUUID();
      cy.get('h1').contains('Check in at VA');
      cy.injectAxe();
      cy.axeCheck();
      cy.signIn();
      cy.get('.appointment-list > li > button', { timeout: Timeouts.slow })
        .should('be.visible')
        .and('contain', 'Check in now');
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
