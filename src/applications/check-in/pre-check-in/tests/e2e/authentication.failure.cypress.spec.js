import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import Error from './pages/Error';

describe('Check In Experience | Pre-Check-In |', () => {
  describe("Patient who does't correctly authenticate", () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializePreCheckInDataGet,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializePreCheckInDataGet.withSuccess();
      cy.visitPreCheckInWithUUID();
      ValidateVeteran.validatePage.preCheckIn();
      cy.injectAxeThenAxeCheck();
    });
    it('should show inline error message', () => {
      ApiInitializer.initializeSessionPost.withValidation();
      ValidateVeteran.validateVeteranIncorrect();
      ValidateVeteran.attemptToGoToNextPage();
      ValidateVeteran.validateErrorAlert();
      cy.injectAxeThenAxeCheck();
    });
    it('should redirect to error page after max validate limit reached', () => {
      ApiInitializer.initializeSessionPost.withValidationMaxAttempts();
      ValidateVeteran.validateVeteranIncorrect();
      ValidateVeteran.attemptToGoToNextPage();
      Error.validatePageLoaded('max-validation');
      cy.injectAxeThenAxeCheck();
    });
  });
});
