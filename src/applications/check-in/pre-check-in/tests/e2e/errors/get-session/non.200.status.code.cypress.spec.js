import '../../../../../tests/e2e/commands';

import ApiInitializer from '../../../../../api/local-mock-api/e2e/ApiInitializer';
import Error from '../../../../../tests/e2e/pages/Error';

describe('Pre-Check In Experience ', () => {
  describe('Error handling', () => {
    describe('GET /check_in/v2/session/', () => {
      beforeEach(function() {
        const {
          initializeFeatureToggle,
          initializeSessionGet,
        } = ApiInitializer;
        initializeFeatureToggle.withCurrentFeatures();
        initializeSessionGet.withFailure(400);
      });
      afterEach(() => {
        cy.window().then(window => {
          window.sessionStorage.clear();
        });
      });
      it('error in the body', () => {
        cy.visitPreCheckInWithUUID();

        Error.validatePageLoaded();
      });
    });
  });
});
