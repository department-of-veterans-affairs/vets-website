import '../../../../../tests/e2e/commands';

import ApiInitializer from '../../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../../tests/e2e/pages/ValidateVeteran';
import Error from '../../pages/Error';

describe('Check In Experience ', () => {
  describe('Error handling - POST /check_in/v2/session/ - Non 200 status code', () => {
    beforeEach(() => {
      const { initializeFeatureToggle, initializeSessionGet } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('bad status code (400)', () => {
      const { initializeSessionPost } = ApiInitializer;
      initializeSessionPost.withFailure(400);
      cy.visitWithUUID();
      // page: Validate
      ValidateVeteran.validatePage.dayOf();
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();

      ValidateVeteran.attemptToGoToNextPage();

      Error.validatePageLoaded();
    });
    it('bad status code (401)', () => {
      const { initializeSessionPost } = ApiInitializer;
      initializeSessionPost.withFailure(401);
      cy.visitWithUUID();
      // page: Validate
      ValidateVeteran.validatePage.dayOf();
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();

      ValidateVeteran.attemptToGoToNextPage();

      ValidateVeteran.validateErrorAlert();
    });
  });
});
