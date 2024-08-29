import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import Error from './pages/Error';

describe('Check In Experience | Pre-Check-In | Appointment Errors', () => {
  const {
    initializeFeatureToggle,
    initializeSessionGet,
    initializeSessionPost,
    initializePreCheckInDataGet,
  } = ApiInitializer;
  describe('Patient who has an expired link', () => {
    it('should take them straight to the error page with expired message', () => {
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withValidation();
      cy.visitPreCheckInWithUUID('354d5b3a-b7b7-4e5c-99e4-8d563f15c521');
      initializePreCheckInDataGet.withExpired();
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.attemptToGoToNextPage();
      Error.validatePageLoadedExpired();
      cy.createScreenshots('Pre-check-in--Errors--expired');
      cy.injectAxeThenAxeCheck();
    });
  });
  describe('Patient who has a canceled appointment', () => {
    it('should take them straight to the error page with canceled message', () => {
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withValidation();
      cy.visitPreCheckInWithUUID('9d7b7c15-d539-4624-8d15-b740b84e8548');
      initializePreCheckInDataGet.withSuccess({
        uuid: '9d7b7c15-d539-4624-8d15-b740b84e8548',
      });
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.attemptToGoToNextPage();
      Error.validateCanceledPageLoaded();
      cy.createScreenshots('Pre-check-in--Errors--canceled');
      cy.injectAxeThenAxeCheck();
    });
  });
});
