import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import Appointments from '../pages/Appointments';
import Confirmation from '../pages/Confirmation';

describe('Check In Experience -- ', () => {
  describe('Confirmation display -- ', () => {
    const appointments = [
      { startTime: '2021-08-19T03:00:00' },
      { startTime: '2021-08-19T03:30:00' },
    ];
    beforeEach(() => {
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
      initializeCheckInDataGet.withSuccess({
        appointments,
      });
      initializeCheckInDataPost.withSuccess();
      initializeDemographicsPatch.withSuccess();
      cy.visitWithUUID();
      ValidateVeteran.validatePage.dayOf();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      Demographics.attemptToGoToNextPage();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.attemptToGoToNextPage();
      Appointments.validatePageLoaded();
      Appointments.attemptCheckIn(1);
    });
    it('confirm page display', () => {
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
    it('confirm page has confirmation message', () => {
      Confirmation.validateConfirmationMessage();
      cy.injectAxeThenAxeCheck();
    });
    it('confirm page has BTSSS link', () => {
      Confirmation.validateBTSSSLink();
      cy.injectAxeThenAxeCheck();
    });
    it('confirm back button', () => {
      Confirmation.validateBackButton(appointments.length);
      cy.injectAxeThenAxeCheck();
    });
    it('refreshes appointments when using the back to appointments link', () => {
      Confirmation.attemptGoBackToAppointments();
      Appointments.validatePageLoaded();
      Appointments.validateAppointmentLength(2);
      // Validate that appointments are refreshed.
      Appointments.validateAppointmentTime(2, '3:30 a.m.');
      cy.injectAxeThenAxeCheck();
    });
  });
});
