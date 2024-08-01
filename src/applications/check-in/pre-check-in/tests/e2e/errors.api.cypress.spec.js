import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import Error from './pages/Error';
import AppointmentsPage from '../../../tests/e2e/pages/AppointmentsPage';
import Demographics from '../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../tests/e2e/pages/EmergencyContact';

describe('Check In Experience | Pre-Check-In | API Errors', () => {
  const {
    initializeFeatureToggle,
    initializeSessionGet,
    initializeSessionPost,
    initializePreCheckInDataGet,
    initializeUpcomingAppointmentsDataGet,
    initializePreCheckInDataPost,
  } = ApiInitializer;
  beforeEach(() => {
    initializeFeatureToggle.withCurrentFeatures();
  });
  describe('Patient who has encounters errors fetching session', () => {
    it('should take them straight to the error page without validation', () => {
      initializeSessionGet.withFailure();
      cy.visitPreCheckInWithUUID();
      Error.validatePageLoadedGeneric();
      cy.createScreenshots('Pre-check-in--Errors--generic');
      cy.injectAxeThenAxeCheck();
    });
  });
  describe('Patient who has encounters errors fetching pre-check-in data', () => {
    it('should take them to the error page after validation', () => {
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializePreCheckInDataGet.withFailure();
      cy.visitPreCheckInWithUUID();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      Error.validatePageLoadedGeneric();
      cy.injectAxeThenAxeCheck();
    });
  });
  describe('Patient who has encounters errors posting pre-check-in', () => {
    it('should take them to the error page when attempting pre-check-in POST', () => {
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializePreCheckInDataGet.withSuccess();
      initializeUpcomingAppointmentsDataGet.withSuccess();
      initializePreCheckInDataPost.withFailure();
      cy.visitPreCheckInWithUUID();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.validatePageLoaded();
      AppointmentsPage.attemptCheckIn();
      Demographics.validatePageLoaded();
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.validatePageLoaded();
      NextOfKin.attemptToGoToNextPage();
      Error.validateAPIErrorPageLoaded();
      cy.createScreenshots('Pre-check-in--Errors--with-data');
      cy.injectAxeThenAxeCheck();
    });
  });
});
