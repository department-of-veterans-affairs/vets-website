import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Introduction from '../pages/Introduction';
import Error from '../pages/Error';

describe('Pre-Check In Experience', () => {
  describe('Validate Page', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializePreCheckInDataGet,
      } = ApiInitializer;
      initializeFeatureToggle.withPhoneAppointments();
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
    it('validation failed with failed response from server. redirect to error page after max validate limit reached', () => {
      cy.injectAxeThenAxeCheck();
      // First Attempt
      ValidateVeteran.validateVeteran('Sith', '4321');
      ValidateVeteran.attemptToGoToNextPage();
      ValidateVeteran.validateErrorAlert();

      // Second Attempt
      ValidateVeteran.validateVeteran('Sith', '4321');
      ValidateVeteran.attemptToGoToNextPage();
      ValidateVeteran.validateErrorAlert();

      // Third/Final attempt
      ValidateVeteran.validateVeteran('Sith', '4321');
      ValidateVeteran.validateErrorAlert();
      ValidateVeteran.attemptToGoToNextPage();

      Error.validatePageLoaded(true, true);
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
