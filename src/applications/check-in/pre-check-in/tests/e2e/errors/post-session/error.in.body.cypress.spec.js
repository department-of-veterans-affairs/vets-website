import '../../../../../tests/e2e/commands';

import ApiInitializer from '../../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../../tests/e2e/pages/ValidateVeteran';
import Error from '../../pages/Error';

describe('Pre-Check In Experience ', () => {
  describe('Error handling', () => {
    describe('POST /check_in/v2/sessions/', () => {
      beforeEach(function() {
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
      it.skip('error in the body', () => {
        // temporarily skipped due to header mismatch failing master deploy.
        cy.visitPreCheckInWithUUID();
        // page: Validate
        ValidateVeteran.validatePageLoaded();
        ValidateVeteran.validateVeteran();
        cy.injectAxeThenAxeCheck();

        ValidateVeteran.attemptToGoToNextPage();

        Error.validatePageLoaded();
      });
    });
  });
});
