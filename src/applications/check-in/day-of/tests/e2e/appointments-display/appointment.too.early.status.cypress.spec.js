import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Appointments from '../pages/Appointments';

describe('Check In Experience -- ', () => {
  describe('Appointment display -- ', () => {
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
    it('Appointment shows early status with time and without', () => {
      Appointments.validateEarlyStatusWithoutTime();
      Appointments.validateEarlyStatusWithTime();
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
