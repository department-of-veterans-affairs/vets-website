import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';
import Appointments from '../pages/Appointments';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import Arrived from '../pages/Arrived';

describe('Check In Experience -- ', () => {
  describe('Appointment display -- ', () => {
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
      AppointmentsPage.attemptCheckIn();
      Arrived.validateArrivedPage();
      Arrived.attemptToGoToNextPage();
      Demographics.attemptToGoToNextPage();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.attemptToGoToNextPage();
      Appointments.validatePageLoaded();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Appointments are displayed in a sorted manner', () => {
      cy.injectAxeThenAxeCheck();
      // refresh the page
      cy.reload();
      Appointments.validateAppointmentLength(3);
      Appointments.validateAppointmentTime();
      Appointments.validateAppointmentTime(3, '6:00 p.m.');
      cy.injectAxeThenAxeCheck();
    });
  });
});
