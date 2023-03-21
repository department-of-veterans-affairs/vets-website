import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Introduction from '../pages/Introduction';

describe('Pre-Check In Experience', () => {
  describe('Introduction Page', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializePreCheckInDataGet,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();

      initializeSessionPost.withSuccess();

      initializePreCheckInDataGet.withSuccess();

      cy.visitPreCheckInWithUUID();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      Introduction.validatePageLoaded();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('intro paragraph is correct', () => {
      Introduction.validateMultipleAppointmentIntroText();
      cy.injectAxeThenAxeCheck();
    });
    it('appointment list has all appointments', () => {
      Introduction.countAppointmentList(2);
      cy.injectAxeThenAxeCheck();
    });
    it('start link styling is correct', () => {
      Introduction.validateStartLinkStyling();
      cy.injectAxeThenAxeCheck();
    });
  });
});
