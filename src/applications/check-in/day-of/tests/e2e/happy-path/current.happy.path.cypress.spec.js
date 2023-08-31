import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Appointments from '../pages/Appointments';
import Confirmation from '../pages/Confirmation';
import Arrived from '../pages/Arrived';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';

describe('Check In Experience', () => {
  describe('happy path', () => {
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
        appointments: [
          { startTime: '2021-08-19T03:00:00' },
          { startTime: '2021-08-19T03:30:00' },
        ],
      });
      initializeCheckInDataPost.withSuccess();
      initializeDemographicsPatch.withSuccess();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('happy path, yes to arrived', () => {
      cy.visitWithUUID();

      ValidateVeteran.validatePage.dayOf();
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Day-of-check-in--Validate');
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Day-of-check-in--Appointments-page');
      AppointmentsPage.attemptCheckIn();
      Arrived.validateArrivedPage();
      cy.createScreenshots('Day-of-check-in--Arrived');
      Arrived.attemptToGoToNextPage();

      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Day-of-check-in--Contact-info');
      Demographics.attemptToGoToNextPage();

      EmergencyContact.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Day-of-check-in--Emergency-contact');
      EmergencyContact.attemptToGoToNextPage();

      NextOfKin.validatePageLoaded(
        'Check-In Is this your current next of kin information?',
      );
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Day-of-check-in--Next-of-kin');
      NextOfKin.attemptToGoToNextPage();

      Appointments.validatePageLoaded();
      Appointments.validateAppointmentLength(2);
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Day-of-check-in--Appointments');

      Appointments.attemptCheckIn(2);
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Day-of-check-in--Confirmation--yes-to-arrived');
    });
    it('happy path, no to arrived', () => {
      cy.visitWithUUID();

      ValidateVeteran.validatePage.dayOf();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      Arrived.attemptToGoToNextPage('no');
      Demographics.attemptToGoToNextPage();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.attemptToGoToNextPage();
      Appointments.attemptCheckIn(2);
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Day-of-check-in--Confirmation--no-to-arrived');
    });
  });
});
