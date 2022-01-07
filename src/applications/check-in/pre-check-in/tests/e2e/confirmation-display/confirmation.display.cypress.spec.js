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
    beforeEach(function() {
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
      NextOfKin.validatePageLoaded();
      NextOfKin.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Confirmation page content loads', () => {
      EmergencyContact.attemptToGoToNextPage();
      Confirmation.validatePageContent();
      cy.injectAxeThenAxeCheck();
    });
    it('Staff update alert message is not visible', () => {
      EmergencyContact.attemptToGoToNextPage();
      Confirmation.validateConfirmNoUpdates();
      cy.injectAxeThenAxeCheck();
    });
    it('Staff update alert message is visible', () => {
      EmergencyContact.attemptToGoToNextPage('no');
      Confirmation.validateConfirmWithUpdates();
      cy.injectAxeThenAxeCheck();
    });
  });
});
