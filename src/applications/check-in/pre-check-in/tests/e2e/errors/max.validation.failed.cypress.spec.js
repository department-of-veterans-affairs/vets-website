import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Error from '../pages/Error';

describe('Pre-Check In Experience', () => {
  describe('max validation attempts -- ', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withValidationMaxAttempts();
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
      // Third/Final attempt
      ValidateVeteran.validateVeteran('Sith', '4321');
      ValidateVeteran.attemptToGoToNextPage();

      Error.validatePageLoaded();
      cy.createScreenshots('Pre-check-in--validation-error');
    });
  });
});
