import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Introduction from '../pages/Introduction';

describe('Pre-Check In Experience', () => {
  describe('Validate Page', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializePreCheckInDataGet,
        initializePreCheckInDataPost,
      } = ApiInitializer;

      initializeFeatureToggle.withLorotaSecurityUpdate();
      initializeSessionGet.withSuccessfulNewSession();
      initializePreCheckInDataGet.withSuccess();

      initializeSessionPost.withValidation();
      initializePreCheckInDataPost.withSuccess();

      cy.visitPreCheckInWithUUID();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('validation failed with failed response from server', () => {
      cy.injectAxeThenAxeCheck();
      // First Attempt
      ValidateVeteran.validateVeteranDobWithFailure();
      ValidateVeteran.attemptToGoToNextPage();
      ValidateVeteran.validateErrorAlert(true);

      // Second Attempt
      ValidateVeteran.validateVeteranDobWithFailure();
      ValidateVeteran.attemptToGoToNextPage();
      ValidateVeteran.validateErrorAlert(true);
    });
    it('fails validation once and then succeeds on the second attempt', () => {
      cy.injectAxeThenAxeCheck();
      // First Attempt
      ValidateVeteran.validateVeteranDobWithFailure();
      ValidateVeteran.attemptToGoToNextPage();
      ValidateVeteran.validateErrorAlert(true);

      // Second Attempt
      ValidateVeteran.validateVeteranDob();
      ValidateVeteran.attemptToGoToNextPage();
      Introduction.validatePageLoaded();
    });
  });
});
