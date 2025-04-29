import '../../../tests/e2e/commands';
import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import AppointmentsPage from '../../../tests/e2e/pages/AppointmentsPage';
import UpcomingAppointmentsPage from '../../../tests/e2e/pages/UpcomingAppointmentsPage';
import AppointmentDetails from '../../../tests/e2e/pages/AppointmentDetails';
import Arrived from './pages/Arrived';
import TravelPages from '../../../tests/e2e/pages/TravelPages';
import Confirmation from './pages/Confirmation';

const dateFns = require('date-fns');

describe('Check In Experience | Day Of |', () => {
  describe('Patient who completes check-in and navigates back to list', () => {
    const {
      initializeFeatureToggle,
      initializeSessionGet,
      initializeSessionPost,
      initializeUpcomingAppointmentsDataGet,
      initializeCheckInDataGet,
      initializeCheckInDataPost,
    } = ApiInitializer;
    beforeEach(() => {
      const appointments = [
        {
          appointmentIen: '0001',
        },
      ];
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withValidation();
      initializeUpcomingAppointmentsDataGet.withSuccess();
      initializeCheckInDataGet.withSuccessAndUpdate({
        appointments,
        demographicsNeedsUpdate: false,
        demographicsConfirmedAt: dateFns.format(
          new Date(),
          "yyyy-LL-dd'T'HH:mm:ss",
        ),
        nextOfKinNeedsUpdate: false,
        nextOfKinConfirmedAt: dateFns.format(
          new Date(),
          "yyyy-LL-dd'T'HH:mm:ss",
        ),
        emergencyContactNeedsUpdate: false,
        emergencyContactConfirmedAt: dateFns.format(
          new Date(),
          "yyyy-LL-dd'T'HH:mm:ss",
        ),
      });
      initializeCheckInDataPost.withSuccess();
      cy.visitWithUUID();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.validatePageLoaded();
      AppointmentsPage.attemptCheckIn();
      Arrived.validateArrivedPage();
      Arrived.attemptToGoToNextPage();
      TravelPages.validatePageLoaded();
      TravelPages.attemptToGoToNextPage('no');
      Confirmation.validatePageLoaded();
    });
    it('should see appointment card removed when going back to appointments', () => {
      Confirmation.attemptGoBackToAppointmentsButton();

      AppointmentsPage.validatePageLoaded();
      AppointmentsPage.validateNoTaskCards();
      cy.createScreenshots('Day-of-check-in--Pages--appointments--no-tasks');
      cy.injectAxeThenAxeCheck();
    });
  });
  describe('Patient who completes check-in and navigates back to upcoming appointments', () => {
    const {
      initializeFeatureToggle,
      initializeSessionGet,
      initializeSessionPost,
      initializeUpcomingAppointmentsDataGet,
      initializeCheckInDataGet,
      initializeCheckInDataPost,
    } = ApiInitializer;
    beforeEach(() => {
      const appointments = [
        {
          appointmentIen: '0001',
        },
      ];
      initializeFeatureToggle.withAllFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withValidation();
      initializeUpcomingAppointmentsDataGet.withSuccess();
      initializeCheckInDataGet.withSuccessAndUpdate({
        appointments,
        demographicsNeedsUpdate: false,
        demographicsConfirmedAt: dateFns.format(
          new Date(),
          "yyyy-LL-dd'T'HH:mm:ss",
        ),
        nextOfKinNeedsUpdate: false,
        nextOfKinConfirmedAt: dateFns.format(
          new Date(),
          "yyyy-LL-dd'T'HH:mm:ss",
        ),
        emergencyContactNeedsUpdate: false,
        emergencyContactConfirmedAt: dateFns.format(
          new Date(),
          "yyyy-LL-dd'T'HH:mm:ss",
        ),
      });
      initializeCheckInDataPost.withSuccess();
      cy.visitWithUUID();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.validatePageLoaded();
      AppointmentsPage.attemptCheckIn();
      Arrived.validateArrivedPage();
      Arrived.attemptToGoToNextPage();
      TravelPages.validatePageLoaded();
      TravelPages.attemptToGoToNextPage('no');
      Confirmation.validatePageLoaded();
    });
    it('should see a list of upcoming appointments', () => {
      Confirmation.attemptGoBackToUpcomingAppointments();

      UpcomingAppointmentsPage.validatePageLoaded();
      UpcomingAppointmentsPage.validateUpcomingAppointmentsList();
      cy.createScreenshots('Day-of-check-in--Pages--Upcoming-Appointments');
      cy.injectAxeThenAxeCheck();
    });
  });
  describe('Patient who completes check-in and navigates back to upcoming appointments but has none', () => {
    const {
      initializeFeatureToggle,
      initializeSessionGet,
      initializeSessionPost,
      initializeUpcomingAppointmentsDataGet,
      initializeCheckInDataGet,
      initializeCheckInDataPost,
    } = ApiInitializer;
    beforeEach(() => {
      const appointments = [
        {
          appointmentIen: '0001',
        },
      ];
      initializeFeatureToggle.withAllFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withValidation();
      initializeUpcomingAppointmentsDataGet.withSuccess({
        uuid: '34de41ed-014c-4734-a4a4-3a4738f5e0d8',
      });
      initializeCheckInDataGet.withSuccessAndUpdate({
        appointments,
        demographicsNeedsUpdate: false,
        demographicsConfirmedAt: dateFns.format(
          new Date(),
          "yyyy-LL-dd'T'HH:mm:ss",
        ),
        nextOfKinNeedsUpdate: false,
        nextOfKinConfirmedAt: dateFns.format(
          new Date(),
          "yyyy-LL-dd'T'HH:mm:ss",
        ),
        emergencyContactNeedsUpdate: false,
        emergencyContactConfirmedAt: dateFns.format(
          new Date(),
          "yyyy-LL-dd'T'HH:mm:ss",
        ),
      });
      initializeCheckInDataPost.withSuccess();
      cy.visitWithUUID();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.validatePageLoaded();
      AppointmentsPage.attemptCheckIn();
      Arrived.validateArrivedPage();
      Arrived.attemptToGoToNextPage();
      TravelPages.validatePageLoaded();
      TravelPages.attemptToGoToNextPage('no');
      Confirmation.validatePageLoaded();
    });
    it('should see a list of upcoming appointments', () => {
      Confirmation.attemptGoBackToUpcomingAppointments();

      UpcomingAppointmentsPage.validatePageLoaded();
      cy.createScreenshots(
        'Day-of-check-in--Pages--Upcoming-Appointments--no-appointments',
      );
      cy.injectAxeThenAxeCheck();
    });
  });
  describe('Patient who navigates to upcoming appointments, details and then back to complete check-in', () => {
    const {
      initializeFeatureToggle,
      initializeSessionGet,
      initializeSessionPost,
      initializeUpcomingAppointmentsDataGet,
      initializeCheckInDataGet,
      initializeCheckInDataPost,
    } = ApiInitializer;
    beforeEach(() => {
      const appointments = [
        {
          appointmentIen: '0001',
        },
      ];
      initializeFeatureToggle.withAllFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withValidation();
      initializeUpcomingAppointmentsDataGet.withSuccess();
      initializeCheckInDataGet.withSuccessAndUpdate({
        appointments,
        demographicsNeedsUpdate: false,
        demographicsConfirmedAt: dateFns.format(
          new Date(),
          "yyyy-LL-dd'T'HH:mm:ss",
        ),
        nextOfKinNeedsUpdate: false,
        nextOfKinConfirmedAt: dateFns.format(
          new Date(),
          "yyyy-LL-dd'T'HH:mm:ss",
        ),
        emergencyContactNeedsUpdate: false,
        emergencyContactConfirmedAt: dateFns.format(
          new Date(),
          "yyyy-LL-dd'T'HH:mm:ss",
        ),
      });
      initializeCheckInDataPost.withSuccess();
      cy.visitWithUUID();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
    });
    it('should complete check in', () => {
      AppointmentsPage.validatePageLoaded();
      AppointmentsPage.attemptGoToUpcomingAppointmentsPage();
      UpcomingAppointmentsPage.validatePageLoaded();
      UpcomingAppointmentsPage.clickUpcomingAppointmentDetails();
      AppointmentDetails.returnToAppointmentsPage();
      UpcomingAppointmentsPage.attemptToGoBack();
      AppointmentsPage.validatePageLoaded();
      AppointmentsPage.attemptCheckIn();
      Arrived.validateArrivedPage();
      Arrived.attemptToGoToNextPage();
      TravelPages.validatePageLoaded();
      TravelPages.attemptToGoToNextPage('no');
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
  });
});
