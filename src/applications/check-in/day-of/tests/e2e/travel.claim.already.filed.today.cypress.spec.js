import '../../../tests/e2e/commands';
import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import AppointmentsPage from '../../../tests/e2e/pages/AppointmentsPage';
import Confirmation from './pages/Confirmation';

const dateFns = require('date-fns');

describe('Check In Experience | Day Of |', () => {
  describe('Patient who wants to file a travel claim but already has today', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeUpcomingAppointmentsDataGet,
        initializeCheckInDataGet,
        initializeCheckInDataPost,
        initializeBtsssPost,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withValidation();
      initializeUpcomingAppointmentsDataGet.withSuccess();
      initializeCheckInDataGet.withSuccess({
        demographicsNeedsUpdate: false,
        demographicsConfirmedAt: dateFns.format(
          new Date(),
          "yyyy-LL-dd'T'HH:mm:ss",
        ),
        nextOfKinNeedsUpdate: false,
        nextOfKinConfirmedAt: dateFns.format(
          new Date(),
          "yyyy-LL-dd'T'HH:mm:ss",
        ),
        emergencyContactNeedsUpdate: false,
        emergencyContactConfirmedAt: dateFns.format(
          new Date(),
          "yyyy-LL-dd'T'HH:mm:ss",
        ),
      });

      initializeCheckInDataPost.withSuccess();
      initializeBtsssPost.withSuccess();
      cy.visitWithUUID();
      window.localStorage.setItem(
        'health.care.check-in.travel.pay.sent',
        JSON.stringify({ '0001': new Date() }),
      );
    });
    it('should complete check and skip all travel questions', () => {
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.attemptToGoToNextPage();

      AppointmentsPage.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      AppointmentsPage.attemptCheckIn();

      Confirmation.validatePageLoaded();
      Confirmation.validatePageLoadedWithNoBtsssClaim();
      cy.injectAxeThenAxeCheck();
    });
  });
});
