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
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withValidation();
      initializePreCheckInDataGet.withSuccess();
      cy.visitPreCheckInWithUUID();
      ValidateVeteran.validatePage.preCheckIn();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('validation failed with failed response from server', () => {
      cy.injectAxeThenAxeCheck();
      // First Attempt
      ValidateVeteran.validateVeteran('Sith', '4321');
      ValidateVeteran.attemptToGoToNextPage();
      ValidateVeteran.validateErrorAlert();
      cy.createScreenshots('Pre-check-in--inline-validation-error');
      // Second Attempt
      ValidateVeteran.validateVeteran('Sith', '4321');
      ValidateVeteran.attemptToGoToNextPage();
      ValidateVeteran.validateErrorAlert();
    });
    it('fails validation once and then succeeds on the second attempt', () => {
      cy.injectAxeThenAxeCheck();
      // First Attempt
      ValidateVeteran.validateVeteran('Sith', '4321');
      ValidateVeteran.attemptToGoToNextPage();
      ValidateVeteran.validateErrorAlert();

      // Second Attempt
      ValidateVeteran.validateVeteran('Smith', '1234');
      ValidateVeteran.attemptToGoToNextPage();
      Introduction.validatePageLoaded();
    });
  });
});
