import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Appointments from '../pages/Appointments';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';

describe('Check In Experience -- ', () => {
  describe('Appointment display -- ', () => {
    beforeEach(function() {
      cy.authenticate();
      const appointments = [
        {
          startTime: '2021-08-19T03:00:00',
          checkedInTime: 'Invalid DateTime',
          eligibility: 'INELIGIBLE_ALREADY_CHECKED_IN',
        },
        {
          startTime: '2021-08-19T13:00:00',
        },
      ];
      cy.getAppointments(appointments);
      cy.successfulCheckin();
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          checkInExperienceUpdateInformationPageEnabled: false,
        }),
      );
      cy.visitWithUUID();
      ValidateVeteran.validatePageLoaded('Check in at VA');
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      Demographics.attemptToGoToNextPage();
      NextOfKin.attemptToGoToNextPage();
      Appointments.validatePageLoaded();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Appointments are displayed in a sorted manner', () => {
      Appointments.validateAppointmentLength(2);
      Appointments.validateAppointmentTime();
      Appointments.validateAlreadyCheckedIn();
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
