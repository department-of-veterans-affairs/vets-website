import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import Confirmation from './pages/Confirmation';

describe('Check In Experience | Pre-Check-In |', () => {
  const {
    initializeFeatureToggle,
    initializeSessionGet,
    initializeSessionPost,
    initializeUpcomingAppointmentsDataGet,
    initializePreCheckInDataGet,
  } = ApiInitializer;
  describe('Patient who has already completed pre-check-in', () => {
    beforeEach(() => {
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withValidation();
      initializeUpcomingAppointmentsDataGet.withSuccess();
      cy.visitPreCheckInWithUUID('4d523464-c450-49dc-9a18-c04b3f1642ee');
    });
    it('should take them straight to the complete page', () => {
      initializePreCheckInDataGet.withSuccess();
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.attemptToGoToNextPage();
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
  });
});
