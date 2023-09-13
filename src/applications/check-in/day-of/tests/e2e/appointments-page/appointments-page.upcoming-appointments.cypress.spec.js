import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Appointments from '../pages/Appointments';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';

describe('Check In Experience -- ', () => {
  describe('Appointments Page -- ', () => {
    beforeEach(() => {
      const appointments = [
        { startTime: '2021-08-19T03:00:00' },
        { startTime: '2021-08-19T13:00:00' },
        { startTime: '2021-08-19T18:00:00' },
      ];

      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataGet,
        initializeCheckInDataPost,
        initializeDemographicsPatch,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeDemographicsPatch.withSuccess();
      initializeCheckInDataGet.withSuccess({ appointments });
      initializeCheckInDataPost.withSuccess();

      cy.visitWithUUID();
      ValidateVeteran.validatePage.dayOf();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.validatePageLoaded();
    });
    it('Appointments are displayed in a sorted manner', () => {
      Appointments.validateAppointmentLength(5);
      Appointments.validateAppointmentTime();
      Appointments.validateAppointmentTime(3, '6:00 p.m.');
      cy.injectAxeThenAxeCheck();
    });
  });
});
