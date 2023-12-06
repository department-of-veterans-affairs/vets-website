import '../../../tests/e2e/commands';
import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import AppointmentsPage from '../../../tests/e2e/pages/AppointmentsPage';
import Confirmation from './pages/Confirmation';

const dateFns = require('date-fns');

describe('Check In Experience | Day Of |', () => {
  describe('Patient who wants to file a travel claim', () => {
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
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('should complete check in if answer is yes to all with already filed message', () => {
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.attemptToGoToNextPage();

      AppointmentsPage.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      AppointmentsPage.attemptCheckIn();

      // TravelPages.validatePageLoaded();
      // cy.injectAxeThenAxeCheck();
      // TravelPages.attemptToGoToNextPage();

      // TravelPages.validatePageLoaded('vehicle');
      // cy.injectAxeThenAxeCheck();
      // TravelPages.attemptToGoToNextPage();

      // TravelPages.validatePageLoaded('address');
      // cy.injectAxeThenAxeCheck();
      // TravelPages.attemptToGoToNextPage();

      // TravelPages.validatePageLoaded('mileage');
      // cy.injectAxeThenAxeCheck();
      // TravelPages.attemptToGoToNextPage();

      Confirmation.validatePageLoaded();
      Confirmation.validatePageLoadedWithBtsssTravelClaimExistsFailure();
      cy.injectAxeThenAxeCheck();
    });
  });
});
