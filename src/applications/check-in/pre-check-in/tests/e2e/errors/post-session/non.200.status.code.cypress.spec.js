import '../../../../../tests/e2e/commands';

import ApiInitializer from '../../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../../tests/e2e/pages/ValidateVeteran';
import Error from '../../pages/Error';

describe('Pre-Check In Experience ', () => {
  describe('Error handling', () => {
    describe('POST /check_in/v2/session/', () => {
      beforeEach(() => {
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
        ValidateVeteran.validatePage.preCheckIn();
        ValidateVeteran.validateVeteran();
        cy.injectAxeThenAxeCheck();

        ValidateVeteran.attemptToGoToNextPage();

        Error.validatePageLoadedGeneric();
      });
      it('bad status code (401)', () => {
        const { initializeSessionPost } = ApiInitializer;
        initializeSessionPost.withFailure(401);
        cy.visitPreCheckInWithUUID();
        // page: Validate
        ValidateVeteran.validatePage.preCheckIn();
        ValidateVeteran.validateVeteran();
        cy.injectAxeThenAxeCheck();

        ValidateVeteran.attemptToGoToNextPage();

        ValidateVeteran.validateErrorAlert();
      });
    });
  });
});
