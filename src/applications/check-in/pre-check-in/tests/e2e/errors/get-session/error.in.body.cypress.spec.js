import '../../../../../tests/e2e/commands';

import ApiInitializer from '../../../../../api/local-mock-api/e2e/ApiInitializer';
import Error from '../../pages/Error';

describe('Pre-Check In Experience ', () => {
  describe('Error handling', () => {
    describe('GET /check_in/v2/session/', () => {
      beforeEach(() => {
        const {
          initializeFeatureToggle,
          initializeSessionGet,
          initializeSessionPost,
          initializePreCheckInDataGet,
        } = ApiInitializer;
        initializeFeatureToggle.withCurrentFeatures();
        initializeSessionGet.withFailure(200);

        initializeSessionPost.withSuccess();

        initializePreCheckInDataGet.withFailure(200);
      });
      afterEach(() => {
        cy.window().then(window => {
          window.sessionStorage.clear();
        });
      });
      it('bad status code(400)', () => {
        cy.visitPreCheckInWithUUID();

        Error.validatePageLoadedGeneric();
        cy.injectAxeThenAxeCheck();
      });
    });
  });
});
