import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../tests/e2e/pages/EmergencyContact';
import Confirmation from './pages/Confirmation';
import AppointmentDetails from '../../../tests/e2e/pages/AppointmentDetails';
import AppointmentsPage from '../../../tests/e2e/pages/AppointmentsPage';

describe('Check In Experience | Pre-check-in', () => {
  describe('A patient who clicks details from appointments list page, then clicks to verify info from details and completes pre-check-in', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializePreCheckInDataGet,
        initializePreCheckInDataPost,
        initializeUpcomingAppointmentsDataGet,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();

      initializeSessionPost.withSuccess();
      initializePreCheckInDataGet.withSuccess();

      initializePreCheckInDataPost.withSuccess();

      initializeUpcomingAppointmentsDataGet.withSuccess();

      cy.visitPreCheckInWithUUID();
    });
    it('Should proceed through the pre-check-in questions to complete the process', () => {
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();

      AppointmentsPage.validatePageLoaded();
      AppointmentsPage.clickUpcomingAppointmentDetails();

      AppointmentDetails.validatePageLoadedInPerson();
      AppointmentDetails.validateSubtitleInPerson();
      AppointmentDetails.validateWhen();
      AppointmentDetails.validateWhat();
      AppointmentDetails.validateProvider();
      AppointmentDetails.validateWhere('in-person');
      AppointmentDetails.validateFacilityAddress(true);
      AppointmentDetails.validateDirectionsLink(true);
      AppointmentDetails.validatePhone();
      cy.injectAxeThenAxeCheck();
      AppointmentDetails.clickReview();

      Demographics.validatePageLoaded();
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.validatePageLoaded();
      NextOfKin.attemptToGoToNextPage();
      Confirmation.validatePageLoaded();
    });
  });
});
