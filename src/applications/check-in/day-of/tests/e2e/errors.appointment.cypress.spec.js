import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import Error from './pages/Error';

describe('Check In Experience | Day Of | Appointment Errors', () => {
  describe('Patient with an expired appointment', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeCheckInDataGet,
        initializeUpcomingAppointmentsDataGet,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeCheckInDataGet.withPast15MinuteWindow();
      initializeUpcomingAppointmentsDataGet.withSuccess();
      cy.visitWithUUID();
      ValidateVeteran.validatePage.dayOf();
      cy.injectAxeThenAxeCheck();
    });
    it('should be directed to the error page after validation', () => {
      ApiInitializer.initializeSessionPost.withValidation();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      Error.validatePageLoaded('check-in-past-appointment');
      cy.createScreenshots('Day-of-check-in--Errors--expired');
      cy.injectAxeThenAxeCheck();
    });
  });
});
