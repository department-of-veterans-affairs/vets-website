import '../../../tests/e2e/commands';
import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import AppointmentsPage from '../../../tests/e2e/pages/AppointmentsPage';
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
      Confirmation.attemptGoBackToAppointments();

      AppointmentsPage.validatePageLoaded();
      AppointmentsPage.validateNoTaskCards();
      cy.createScreenshots('Day-of-check-in--Pages--appointments--no-tasks');
      cy.injectAxeThenAxeCheck();
    });
  });
});
