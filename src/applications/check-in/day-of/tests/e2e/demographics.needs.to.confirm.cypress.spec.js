import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import AppointmentsPage from '../../../tests/e2e/pages/AppointmentsPage';
import Demographics from '../../../tests/e2e/pages/Demographics';
import EmergencyContact from '../../../tests/e2e/pages/EmergencyContact';
import NextOfKin from '../../../tests/e2e/pages/NextOfKin';
import TravelPages from '../../../tests/e2e/pages/TravelPages';
import Arrived from './pages/Arrived';
import SeeStaff from './pages/SeeStaff';
import Confirmation from './pages/Confirmation';
import AppointmentDetails from '../../../tests/e2e/pages/AppointmentDetails';

describe('Check In Experience | Day Of |', () => {
  describe('Patient who needs to confirm demographics', () => {
    beforeEach(() => {
      const appointments = [
        {
          appointmentIen: '0001',
        },
      ];
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeUpcomingAppointmentsDataGet,
        initializeCheckInDataGet,
        initializeCheckInDataPost,
        initializeDemographicsPatch,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withValidation();
      initializeUpcomingAppointmentsDataGet.withSuccess();
      initializeCheckInDataGet.withSuccessAndUpdate({ appointments });
      initializeCheckInDataPost.withSuccess();
      initializeDemographicsPatch.withSuccess();
      cy.visitWithUUID();
    });
    it('should complete check in if answer is yes to all demographics questions', () => {
      cy.createScreenshots('Day-of-check-in--Pages--auth');
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.attemptToGoToNextPage();

      AppointmentsPage.validatePageLoaded();
      cy.createScreenshots('Day-of-check-in--Pages--appointments');
      cy.injectAxeThenAxeCheck();
      AppointmentsPage.attemptCheckIn();

      Arrived.validateArrivedPage();
      cy.createScreenshots('Day-of-check-in--Pages--arrived');
      cy.injectAxeThenAxeCheck();
      Arrived.attemptToGoToNextPage();

      Demographics.validatePageLoaded();
      cy.createScreenshots('Day-of-check-in--Pages--contact-info');
      cy.injectAxeThenAxeCheck();
      Demographics.attemptToGoToNextPage();

      EmergencyContact.validatePageLoaded();
      cy.createScreenshots('Day-of-check-in--Pages--emergency-contact');
      cy.injectAxeThenAxeCheck();
      EmergencyContact.attemptToGoToNextPage();

      NextOfKin.validatePageLoaded();
      cy.createScreenshots('Day-of-check-in--Pages--next-of-kin');
      cy.injectAxeThenAxeCheck();
      NextOfKin.attemptToGoToNextPage();

      TravelPages.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage('no');

      Confirmation.validatePageLoaded();
      Confirmation.clickDetails();
      AppointmentDetails.validatePageLoadedInPerson();
      cy.createScreenshots('Day-of-check-in--Pages--details--after-check-in');
      cy.injectAxeThenAxeCheck();
    });
    it('should direct patient to front desk if answer is no to demographics question', () => {
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.attemptToGoToNextPage();

      AppointmentsPage.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      AppointmentsPage.attemptCheckIn();

      Arrived.validateArrivedPage();
      cy.injectAxeThenAxeCheck();
      Arrived.attemptToGoToNextPage();

      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Demographics.attemptToGoToNextPage('no');

      SeeStaff.validatePageLoaded();
      cy.createScreenshots('Day-of-check-in--Pages--see-staff');
      cy.injectAxeThenAxeCheck();
    });
  });
});
