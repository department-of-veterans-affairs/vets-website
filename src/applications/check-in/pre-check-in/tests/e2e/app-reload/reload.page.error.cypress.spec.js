import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';
import Confirmation from '../pages/Confirmation';
import Error from '../pages/Error';

describe('Pre-Check In Experience', () => {
  describe('reload pages', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializePreCheckInDataGet,
        initializePreCheckInDataPost,
        initializeDemographicsPatch,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeDemographicsPatch.withSuccess();
      initializeSessionGet.withSuccessfulNewSession();

      initializeSessionPost.withSuccess();

      initializePreCheckInDataGet.withSuccess();

      initializePreCheckInDataPost.withSuccess();
      cy.visitPreCheckInWithUUID();
      ValidateVeteran.validatePage.preCheckIn();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.attemptPreCheckIn();
      Demographics.validatePageLoaded();
      initializePreCheckInDataGet.withFailure();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });

    it('Demographics page', () => {
      cy.reload();
      Error.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
    it('emergency contact page', () => {
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      cy.reload();
      Error.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
    it('next of kin page', () => {
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.validatePageLoaded();
      cy.reload();
      Error.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });

    it('confirmation page', () => {
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.validatePageLoaded();
      NextOfKin.attemptToGoToNextPage();
      Confirmation.validatePageLoaded();
      cy.reload();
      Error.validatePageLoaded();
      cy.createScreenshots('Pre-check-in--reload--data-error');
      cy.injectAxeThenAxeCheck();
    });
  });
});
