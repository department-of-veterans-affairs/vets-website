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
      initializeDemographicsPatch.withSuccess();
      initializeCheckInDataGet.withSuccess({
        appointments: [
          { startTime: '2021-08-19T03:00:00' },
          { startTime: '2021-08-19T03:30:00' },
        ],
      });
      initializeCheckInDataPost.withSuccess();
      cy.visitWithUUID();

      ValidateVeteran.validatePage.dayOf();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.attemptCheckIn();

      Arrived.validateArrivedPage();
      Arrived.attemptToGoToNextPage();

      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Demographics.attemptToGoToNextPage();

      EmergencyContact.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      EmergencyContact.attemptToGoToNextPage();

      NextOfKin.validatePageLoaded(
        'Check-In Is this your current next of kin information?',
      );
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('should have a functional back button', () => {
      cy.injectAxeThenAxeCheck();
      NextOfKin.validateBackButton();
      NextOfKin.attemptToGoToNextPage();

      cy.get('[data-testid="back-button"]').click();
      NextOfKin.validatePageLoaded(
        'Check-In Is this your current next of kin information?',
      );

      cy.get('[data-testid="back-button"]').click();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();

      NextOfKin.validatePageLoaded(
        'Check-In Is this your current next of kin information?',
      );
    });
    it('removes back button from appointment list when check in is complete', () => {
      cy.injectAxeThenAxeCheck();
      NextOfKin.attemptToGoToNextPage();

      Appointments.validatePageLoaded();
      Appointments.validateAppointmentLength(2);
      cy.injectAxeThenAxeCheck();

      Appointments.attemptCheckIn(2);
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();

      Confirmation.attemptGoBackToAppointments();
      Appointments.validatePageLoaded();
      cy.get('[data-testid="back-button"]').should('not.exist');
    });
    it('prevents users from navigating to any of the question pages when check in is complete', () => {
      cy.injectAxeThenAxeCheck();
      NextOfKin.attemptToGoToNextPage();

      Appointments.validatePageLoaded();
      Appointments.validateAppointmentLength(2);
      cy.injectAxeThenAxeCheck();

      Appointments.attemptCheckIn(2);
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();

      Confirmation.attemptGoBackToAppointments();
      Appointments.validatePageLoaded();

      cy.visit('/health-care/appointment-check-in/contact-information');
      Appointments.validatePageLoaded();

      cy.visit('/health-care/appointment-check-in/emergency-contact');
      Appointments.validatePageLoaded();

      cy.visit('/health-care/appointment-check-in/next-of-kin');
      Appointments.validatePageLoaded();

      cy.visit('/health-care/appointment-check-in/travel-pay');
      Appointments.validatePageLoaded();

      cy.visit('/health-care/appointment-check-in/travel-vehicle');
      Appointments.validatePageLoaded();

      cy.visit('/health-care/appointment-check-in/travel-address');
      Appointments.validatePageLoaded();

      cy.visit('/health-care/appointment-check-in/travel-mileage');
      Appointments.validatePageLoaded();
    });
  });
});
