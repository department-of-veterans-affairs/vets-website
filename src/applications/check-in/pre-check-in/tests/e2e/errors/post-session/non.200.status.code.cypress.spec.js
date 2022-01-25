import '../../../../../tests/e2e/commands';

import ApiInitializer from '../../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../../tests/e2e/pages/ValidateVeteran';

describe('Pre-Check In Experience ', () => {
  describe('Error handling', () => {
    describe('POST /check_in/v2/session/', () => {
      beforeEach(function() {
        const {
          initializeFeatureToggle,
          initializeSessionGet,
        } = ApiInitializer;
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
        cy.visitPreCheckInWithUUID();
        // page: Validate
        ValidateVeteran.validatePageLoaded();
        ValidateVeteran.validateVeteran();
        cy.injectAxeThenAxeCheck();

        ValidateVeteran.attemptToGoToNextPage();
        // Stay on validate page after failed validate attempt
        ValidateVeteran.validateVeteran();
      });
    });
  });
});
