import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Error from '../../../../tests/e2e/pages/Error';

describe('Pre-Check In Experience', () => {
  // @TODO: un-skip when the error page is created.
  describe('Validate Page', () => {
    beforeEach(function() {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('validation failed with failed response from server', () => {
      cy.visitPreCheckInWithUUID();
      ValidateVeteran.validatePageLoaded();
      cy.injectAxeThenAxeCheck();

      ValidateVeteran.typeLastName('Smith');
      ValidateVeteran.typeLast4('1234');
      ValidateVeteran.attemptToGoToNextPage();

      Error.validatePageLoaded();
    });
  });
});
