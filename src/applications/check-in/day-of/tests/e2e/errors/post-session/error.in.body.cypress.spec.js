import '../../../../../tests/e2e/commands';

import ApiInitializer from '../../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../../tests/e2e/pages/ValidateVeteran';
import Error from '../../pages/Error';

describe('Check In Experience ', () => {
  describe('Error handling - POST /check_in/v2/sessions/ - error in the body', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();

      initializeSessionPost.withFailure(200);
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('attempt to sign in with an error', () => {
      cy.visitWithUUID();
      // page: Validate
      ValidateVeteran.validatePage.dayOf();
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();

      ValidateVeteran.attemptToGoToNextPage();

      Error.validatePageLoaded();
    });
  });
});
