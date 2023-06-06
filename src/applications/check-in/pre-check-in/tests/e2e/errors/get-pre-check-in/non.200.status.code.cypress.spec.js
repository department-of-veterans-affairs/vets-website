import '../../../../../tests/e2e/commands';

import ApiInitializer from '../../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../../tests/e2e/pages/ValidateVeteran';
import Error from '../../pages/Error';

describe('Pre-Check In Experience ', () => {
  describe('Error handling', () => {
    describe('GET /check_in/v2/pre_check_ins/', () => {
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

        initializePreCheckInDataGet.withFailure(400);
      });
      afterEach(() => {
        cy.window().then(window => {
          window.sessionStorage.clear();
        });
      });
      it('error in the body', () => {
        cy.visitPreCheckInWithUUID();
        // page: Validate
        ValidateVeteran.validatePage.preCheckIn();
        cy.injectAxeThenAxeCheck();
        ValidateVeteran.validateVeteran();
        ValidateVeteran.attemptToGoToNextPage();
        Error.validatePageLoadedGeneric();
      });
    });
  });
});
