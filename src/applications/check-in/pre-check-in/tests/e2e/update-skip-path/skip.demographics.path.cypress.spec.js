import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Introduction from '../pages/Introduction';
import Confirmation from '../pages/Confirmation';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';

describe('Pre Check In Experience', () => {
  describe('update skip path', () => {
    beforeEach(function() {
      const now = Date.now();
      const today = new Date(now);
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializePreCheckInDataGet,
        initializePreCheckInDataPost,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializePreCheckInDataGet.withSuccess({
        demographicsNeedsUpdate: false,
        demographicsConfirmedAt: today.toISOString(),
        nextOfKinNeedsUpdate: true,
        nextOfKinConfirmedAt: today.toISOString(),
        emergencyContactNeedsUpdate: true,
        emergencyContactConfirmedAt: today.toISOString(),
      });
      initializePreCheckInDataPost.withSuccess();

      cy.visitPreCheckInWithUUID();
      ValidateVeteran.validatePageLoaded();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      Introduction.validatePageLoaded();
      Introduction.attemptToGoToNextPage();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('skip demographics, update next of kin path, and update emergency contact', () => {
      NextOfKin.validatePageLoaded();
      NextOfKin.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
  });
});
