import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Introduction from '../pages/Introduction';

// TODO: remove commment once this is not disallowed
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
    it('accordion opens and closes', () => {
      cy.injectAxeThenAxeCheck();
      Introduction.toggleAccordion(0, true);
      cy.injectAxeThenAxeCheck();
      Introduction.toggleAccordion(0, false);
      cy.injectAxeThenAxeCheck();
    });
  });
});
