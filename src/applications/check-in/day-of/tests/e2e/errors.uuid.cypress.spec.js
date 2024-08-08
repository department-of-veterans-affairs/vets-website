import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import Error from './pages/Error';

describe('Check In Experience | Day Of | Errors', () => {
  beforeEach(() => {
    const { initializeFeatureToggle, initializeSessionGet } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withSuccessfulNewSession();
  });
  describe('Patient with no uuid', () => {
    it('should be directed to the error page', () => {
      cy.visitWithUUID('');
      Error.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
  });
  describe('Patient with a malformed uuid', () => {
    it('should be directed to the error page', () => {
      cy.visitWithUUID('not-a-uuid');
      Error.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
  });
  describe('Patient who encounters an error fetching session', () => {
    it('should be directed to the error page', () => {
      ApiInitializer.initializeSessionGet.withFailure();
      cy.visitWithUUID();
      Error.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
  });
  describe('Patient with a UUID that is not found', () => {
    it('should be directed to the error page', () => {
      ApiInitializer.initializeCheckInDataGet.withUuidNotFound();
      ApiInitializer.initializeSessionPost.withValidation();
      cy.visitWithUUID();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      Error.validatePageLoaded('uuid-not-found');
      cy.injectAxeThenAxeCheck();
    });
  });
});
