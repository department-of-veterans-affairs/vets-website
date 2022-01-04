import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Appointments from '../pages/Appointments';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';

describe('Check In Experience', () => {
  describe('Appointment display', () => {
    beforeEach(function() {
      const appointments = [
        {
          startTime: '2021-08-19T03:00:00',
          eligibility: 'INELIGIBLE_ALREADY_CHECKED_IN',
        },
        {
          startTime: '2021-08-19T13:00:00',
        },
      ];
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataGet,
      } = ApiInitializer;
      initializeFeatureToggle.withoutEmergencyContact();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeCheckInDataGet.withSuccess({ appointments });

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
      cy.injectAxeThenAxeCheck();
      Appointments.validateAppointmentTime();
      Appointments.validateAlreadyCheckedIn();
    });
  });
});
