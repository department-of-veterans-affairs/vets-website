import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import Error from './pages/Error';

describe('Check In Experience | Pre-Check-In |', () => {
  const {
    initializeFeatureToggle,
    initializeSessionGet,
    initializeSessionPost,
    initializePreCheckInDataGet,
  } = ApiInitializer;
  describe('Patient who has an expired link', () => {
    beforeEach(() => {
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withValidation();
      cy.visitPreCheckInWithUUID('354d5b3a-b7b7-4e5c-99e4-8d563f15c521');
    });
    it('should take them straight to the error page', () => {
      initializePreCheckInDataGet.withSuccess({
        uuid: '354d5b3a-b7b7-4e5c-99e4-8d563f15c521',
      });
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.attemptToGoToNextPage();
      Error.validatePageLoadedExpired();
      cy.injectAxeThenAxeCheck();
    });
  });
});
