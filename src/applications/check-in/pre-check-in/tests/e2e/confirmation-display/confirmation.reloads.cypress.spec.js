import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Introduction from '../pages/Introduction';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Confirmation from '../pages/Confirmation';

describe('Pre-Check In Experience', () => {
  describe('Next of kin Page', () => {
    beforeEach(() => {
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
      initializePreCheckInDataGet.withSuccess();

      initializePreCheckInDataPost.withSuccess();

      cy.visitPreCheckInWithUUID();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      Introduction.validatePageLoaded();
      Introduction.attemptToGoToNextPage();
      Demographics.validatePageLoaded();
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.validatePageLoaded();
      NextOfKin.attemptToGoToNextPage();
      Confirmation.validatePageContent();
    });
    it('reloads of confirmation page should redirect back to verify page', () => {
      cy.injectAxeThenAxeCheck();
      cy.reload();
      ValidateVeteran.validatePage.preCheckIn();

      // moved afterEach here to
      // avoid async clearing of session storage
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
  });
});
