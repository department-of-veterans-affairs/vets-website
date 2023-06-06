import '../../../../../tests/e2e/commands';

import ApiInitializer from '../../../../../api/local-mock-api/e2e/ApiInitializer';
import Error from '../../pages/Error';

describe('Pre-Check In Experience ', () => {
  describe('500 error handling', () => {
    describe('GET /check_in/v2/session/', () => {
      beforeEach(() => {
        const {
          initializeFeatureToggle,
          initializeSessionGet,
        } = ApiInitializer;
        initializeFeatureToggle.withCurrentFeatures();
        initializeSessionGet.withFailure(500);
      });
      afterEach(() => {
        cy.window().then(window => {
          window.sessionStorage.clear();
        });
      });
      it('error in the body', () => {
        cy.visitPreCheckInWithUUID();

        Error.validateUUIDErrorPageLoaded();
        cy.injectAxeThenAxeCheck();
        cy.createScreenshots('Pre-check-in--UUID-error');
      });
    });
  });
});
