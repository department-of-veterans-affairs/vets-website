import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Appointments from '../pages/Appointments';

describe('Check In Experience -- ', () => {
  describe('Appointment display -- ', () => {
    beforeEach(function() {
      cy.authenticate();
      const appointments = [{ eligibility: 'ELIGIBLE' }];
      cy.getAppointments(appointments);
      cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles({}));
      cy.visitWithUUID();
      ValidateVeteran.validatePageLoaded('Check in at VA');
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Appointment is eligible for checkin and button is present.', () => {
      Appointments.validateEligibleStatus();
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
