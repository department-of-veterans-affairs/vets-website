import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import Error from './pages/Error';

describe('Check In Experience | Pre-Check-In | UUID Errors', () => {
  const {
    initializeFeatureToggle,
    initializeSessionGet,
    initializeSessionPost,
    initializePreCheckInDataGet,
  } = ApiInitializer;
  beforeEach(() => {
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withSuccessfulNewSession();
  });
  describe('Patient who has no UUID', () => {
    it('should take them straight to the error page without validation', () => {
      cy.visitPreCheckInWithUUID('');
      Error.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
  });
  describe('Patient with a malformed uuid', () => {
    it('should take them straight to the error page without validation', () => {
      cy.visitPreCheckInWithUUID('not-a-uuid');
      Error.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
  });
  describe('Patient with a UUID that is not found', () => {
    it('should take them straight to the error page after validation', () => {
      initializePreCheckInDataGet.withUuidNotFound();
      initializeSessionPost.withValidation();
      cy.visitPreCheckInWithUUID();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      Error.validatePageLoadedNotAvailable();
      cy.injectAxeThenAxeCheck();
    });
  });
});
