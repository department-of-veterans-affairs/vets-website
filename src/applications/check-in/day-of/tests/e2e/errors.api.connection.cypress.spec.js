import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import Error from './pages/Error';
import Confirmation from './pages/Confirmation';
import Demographics from '../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../tests/e2e/pages/EmergencyContact';
import AppointmentsPage from '../../../tests/e2e/pages/AppointmentsPage';
import TravelPages from '../../../tests/e2e/pages/TravelPages';
import Arrived from './pages/Arrived';

describe('Check In Experience | Day Of | API Errors', () => {
  const {
    initializeFeatureToggle,
    initializeSessionGet,
    initializeSessionPost,
    initializeCheckInDataGet,
    initializeCheckInDataPost,
    initializeDemographicsPatch,
    initializeBtsssPost,
  } = ApiInitializer;
  beforeEach(() => {
    initializeFeatureToggle.withCurrentFeatures();
  });
  describe('Patient who encounters an error getting check in data', () => {
    it('should redirect to the generic error page', () => {
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeCheckInDataGet.withFailure();
      cy.visitWithUUID();
      // page: Validate
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.attemptToGoToNextPage();
      Error.validatePageLoaded();
    });
  });
  describe('Patient who encounters an error when checking in', () => {
    it('should redirect to the generic error page with check-in failed', () => {
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeDemographicsPatch.withSuccess();
      initializeCheckInDataGet.withSuccess();
      initializeCheckInDataPost.withFailure(200);
      cy.visitWithUUID();
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
      Demographics.attemptToGoToNextPage();

      EmergencyContact.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      EmergencyContact.attemptToGoToNextPage();

      NextOfKin.validatePage.dayOf();
      cy.injectAxeThenAxeCheck();
      NextOfKin.attemptToGoToNextPage();

      TravelPages.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage('no');

      Error.validatePageLoaded('check-in-failed-find-out');
      cy.injectAxe();
      cy.axeCheck();
    });
  });
  describe('Patient who encounters an error when submitting a travel claim', () => {
    it('should confirm the check-in but display a message about the BTSSS error', () => {
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeDemographicsPatch.withSuccess();
      initializeCheckInDataGet.withSuccess();
      initializeCheckInDataPost.withSuccess();
      initializeBtsssPost.withFailure();
      cy.visitWithUUID();
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
      Demographics.attemptToGoToNextPage();

      EmergencyContact.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      EmergencyContact.attemptToGoToNextPage();

      NextOfKin.validatePage.dayOf();
      cy.injectAxeThenAxeCheck();
      NextOfKin.attemptToGoToNextPage();

      TravelPages.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('vehicle');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('address');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('mileage');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('review');
      cy.injectAxeThenAxeCheck();
      TravelPages.acceptTerms();
      TravelPages.attemptToGoToNextPage();
      Confirmation.validatePageLoadedWithBtsssGenericFailure();
      cy.injectAxeThenAxeCheck();
    });
  });
  describe('Patient who encounters an error when patching demographics', () => {
    it('should redirect to the generic error page', () => {
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeDemographicsPatch.withFailure();
      initializeCheckInDataGet.withSuccess();
      initializeCheckInDataPost.withSuccess();
      cy.visitWithUUID();
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
      Demographics.attemptToGoToNextPage();

      EmergencyContact.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      EmergencyContact.attemptToGoToNextPage();

      NextOfKin.validatePage.dayOf();
      cy.injectAxeThenAxeCheck();
      NextOfKin.attemptToGoToNextPage();

      TravelPages.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage('no');

      Error.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
  });
});
