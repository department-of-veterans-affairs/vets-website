import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import Error from './pages/Error';

describe('Check In Experience | Day Of |', () => {
  describe("Patient who does't correctly authenticate", () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeCheckInDataGet,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeCheckInDataGet.withSuccess();
      cy.visitWithUUID();
      ValidateVeteran.validatePage.dayOf();
      cy.injectAxeThenAxeCheck();
    });
    it('should show inline error message', () => {
      ApiInitializer.initializeSessionPost.withValidation();
      ValidateVeteran.validateVeteranIncorrect();
      ValidateVeteran.attemptToGoToNextPage();
      ValidateVeteran.validateErrorAlert();
      cy.createScreenshots('Day-of-check-in--Errors--inline-validation');
      cy.injectAxeThenAxeCheck();
    });
    it('should redirect to error page after max validate limit reached', () => {
      ApiInitializer.initializeSessionPost.withValidationMaxAttempts();
      ValidateVeteran.validateVeteranIncorrect();
      ValidateVeteran.attemptToGoToNextPage();
      Error.validatePageLoaded('max-validation');
      cy.createScreenshots('Day-of-check-in--Errors--max-validation');
      cy.injectAxeThenAxeCheck();
    });
  });
});
