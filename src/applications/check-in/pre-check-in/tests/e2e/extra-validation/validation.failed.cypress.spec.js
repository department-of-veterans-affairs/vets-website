import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Error from '../pages/Error';

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
      initializeSessionPost.withFailure();
      cy.visitPreCheckInWithUUID();
      ValidateVeteran.validatePageLoaded('Start pre-check-in');
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('validation failed with failed response from server', () => {
      cy.injectAxeThenAxeCheck();
      // First Attempt
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      ValidateVeteran.validateErrorAlert();

      // Second Attempt
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      ValidateVeteran.validateErrorAlert();

      // Third/Final attempt
      ValidateVeteran.validateVeteran();
      ValidateVeteran.validateErrorAlert(true);
      ValidateVeteran.attemptToGoToNextPage();

      Error.validatePageLoaded(true);
    });
  });
});
