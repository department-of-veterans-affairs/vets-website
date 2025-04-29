import '../../../tests/e2e/commands';
import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import AppointmentsPage from '../../../tests/e2e/pages/AppointmentsPage';
import TravelPages from '../../../tests/e2e/pages/TravelPages';
import Confirmation from './pages/Confirmation';
import Arrived from './pages/Arrived';

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
    });
    it('should complete check in if answer is yes to all', () => {
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.attemptToGoToNextPage();

      AppointmentsPage.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      AppointmentsPage.attemptCheckIn();

      Arrived.validateArrivedPage();
      cy.injectAxeThenAxeCheck();
      Arrived.attemptToGoToNextPage();

      TravelPages.validatePageLoaded();
      cy.createScreenshots('Day-of-check-in--Pages--travel-question');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();

      TravelPages.validatePageLoaded('mileage');
      cy.createScreenshots('Day-of-check-in--Pages--travel-mileage-question');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();

      TravelPages.validatePageLoaded('vehicle');
      cy.createScreenshots('Day-of-check-in--Pages--travel-vehicle-question');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();

      TravelPages.validatePageLoaded('address');
      cy.createScreenshots('Day-of-check-in--Pages--travel-address-question');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();

      TravelPages.validatePageLoaded('review');
      cy.createScreenshots('Day-of-check-in--Pages--travel-review');
      cy.injectAxeThenAxeCheck();
      TravelPages.acceptTerms();
      TravelPages.attemptToGoToNextPage();

      Confirmation.validatePageLoaded();
      Confirmation.validatePageLoadedWithBtsssSubmission();
      cy.createScreenshots(
        'Day-of-check-in--Pages--confirmation-travel-success',
      );
      cy.injectAxeThenAxeCheck();
    });
    it('should complete check in if answer is no to vehicle question', () => {
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.attemptToGoToNextPage();

      AppointmentsPage.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      AppointmentsPage.attemptCheckIn();

      Arrived.validateArrivedPage();
      cy.injectAxeThenAxeCheck();
      Arrived.attemptToGoToNextPage();

      TravelPages.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();

      TravelPages.validatePageLoaded('mileage');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage('no');

      Confirmation.validatePageLoaded();
      Confirmation.validatePageLoadedWithBtsssIneligible();
      cy.createScreenshots(
        'Day-of-check-in--Pages--confirmation-travel-ineligible',
      );
      cy.injectAxeThenAxeCheck();
    });
    it('should complete check in if does not agree to terms and chooses to file later', () => {
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.attemptToGoToNextPage();

      AppointmentsPage.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      AppointmentsPage.attemptCheckIn();

      Arrived.validateArrivedPage();
      cy.injectAxeThenAxeCheck();
      Arrived.attemptToGoToNextPage();

      TravelPages.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();

      TravelPages.validatePageLoaded('mileage');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();

      TravelPages.validatePageLoaded('vehicle');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();

      TravelPages.validatePageLoaded('address');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();

      TravelPages.validatePageLoaded('review');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();
      TravelPages.checkForValidationError();
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage('no');
      Confirmation.validatePageLoaded();
      Confirmation.validatePageLoadedWithNoBtsssClaim();
      cy.injectAxeThenAxeCheck();
    });
    it('should complete check in if edits at review and continues', () => {
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.attemptToGoToNextPage();

      AppointmentsPage.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      AppointmentsPage.attemptCheckIn();

      Arrived.validateArrivedPage();
      cy.injectAxeThenAxeCheck();
      Arrived.attemptToGoToNextPage();

      TravelPages.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();

      TravelPages.validatePageLoaded('mileage');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();

      TravelPages.validatePageLoaded('vehicle');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();

      TravelPages.validatePageLoaded('address');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();

      TravelPages.validatePageLoaded('review');
      cy.injectAxeThenAxeCheck();
      TravelPages.clickStartOver();

      TravelPages.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();

      TravelPages.validatePageLoaded('mileage');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();

      TravelPages.validatePageLoaded('vehicle');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();

      TravelPages.validatePageLoaded('address');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();

      TravelPages.validatePageLoaded('review');
      cy.injectAxeThenAxeCheck();
      TravelPages.acceptTerms();
      TravelPages.attemptToGoToNextPage();

      Confirmation.validatePageLoaded();
      Confirmation.validatePageLoadedWithBtsssSubmission();
      cy.injectAxeThenAxeCheck();
    });
  });
});
