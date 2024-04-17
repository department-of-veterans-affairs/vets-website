import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import Error from './pages/Error';

describe('A patient that attempts to log in with an incorrect last name and dob ', () => {
  beforeEach(() => {
    const { initializeFeatureToggle, initializeSessionGet } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withSuccessfulNewSession();
    cy.visitTravelClaimWithUUID();
    ValidateVeteran.validatePage.travelClaim();
  });
  it('should display the inline error message', () => {
    ApiInitializer.initializeSessionPost.withValidation();
    cy.injectAxeThenAxeCheck();
    ValidateVeteran.validateVeteranIncorrect();
    ValidateVeteran.attemptToGoToNextPage();
    ValidateVeteran.validateErrorAlert();
    cy.createScreenshots('Travel-claim--inline-validation-error');
  });
  it('should display the error page', () => {
    ApiInitializer.initializeSessionPost.withValidationMaxAttempts();
    cy.injectAxeThenAxeCheck();
    ValidateVeteran.validateVeteranIncorrect();
    ValidateVeteran.attemptToGoToNextPage();

    Error.validatePageLoaded();
    Error.validateErrorAlert('max-validation');
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Travel-claim--max-validation-error');
  });
});
