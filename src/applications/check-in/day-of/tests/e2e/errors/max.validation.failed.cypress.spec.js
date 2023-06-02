import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Error from '../pages/Error';

describe('Check In Experience -- ', () => {
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
      cy.visitWithUUID();
      ValidateVeteran.validatePage.dayOf();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('validation failed with failed response from server. redirect to error page after max validate limit reached', () => {
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.validateVeteran('Sith', '4321');
      ValidateVeteran.attemptToGoToNextPage();

      Error.validatePageLoaded('max-validation');
      cy.createScreenshots('Day-of-check-in--Error-validation-error');
    });
  });
});
