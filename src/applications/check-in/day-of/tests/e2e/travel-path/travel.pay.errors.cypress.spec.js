import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import TravelPages from '../../../../tests/e2e/pages/TravelPages';
import Appointments from '../pages/Appointments';
import Error from '../pages/Error';
import Arrived from '../pages/Arrived';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';

describe('Check In Experience', () => {
  describe('travel pay path', () => {
    beforeEach(() => {
      const appointments = [{ startTime: '2021-08-19T03:00:00' }];
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataGet,
        initializeCheckInDataPost,
        initializeDemographicsPatch,
      } = ApiInitializer;
      initializeFeatureToggle.withTravelPay();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeDemographicsPatch.withSuccess();
      initializeCheckInDataGet.withSuccess({
        appointments,
      });
      initializeCheckInDataPost.withFailure(200);
      cy.visitWithUUID();
      ValidateVeteran.validatePage.dayOf();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.attemptCheckIn();
      Arrived.validateArrivedPage();
      Arrived.attemptToGoToNextPage();
      Demographics.validatePageLoaded();
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.validatePageLoaded(
        'Check-In Is this your current next of kin information?',
      );
      NextOfKin.attemptToGoToNextPage();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('shows the correct error message for check in failed no to travel claim', () => {
      TravelPages.validatePageLoaded();
      TravelPages.attemptToGoToNextPage('no');
      Appointments.validatePageLoaded();
      Appointments.attemptCheckIn(1);
      Error.validatePageLoaded('check-in-failed-find-out');
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots(
        'Day-of-check-in--travel-pay--check-in-error--no-travel',
      );
    });
    it('shows the correct error message for check in failed no to travel vehicle', () => {
      TravelPages.validatePageLoaded();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('mileage');
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('vehicle');
      TravelPages.attemptToGoToNextPage('no');
      Appointments.validatePageLoaded();
      Appointments.attemptCheckIn(1);
      Error.validatePageLoaded('check-in-failed-cant-file');
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots(
        'Day-of-check-in--travel-pay--check-in-error--no-vehicle',
      );
    });
    it('shows the correct error message for check in failed no to travel address', () => {
      TravelPages.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('mileage');
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('vehicle');
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('address');
      TravelPages.attemptToGoToNextPage('no');
      Appointments.validatePageLoaded();
      Appointments.attemptCheckIn(1);
      Error.validatePageLoaded('check-in-failed-cant-file');
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots(
        'Day-of-check-in--travel-pay--check-in-error--no-address',
      );
    });
    it('shows the correct error message for check in failed no to travel mileage', () => {
      TravelPages.validatePageLoaded();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('mileage');
      TravelPages.attemptToGoToNextPage('no');
      Appointments.validatePageLoaded();
      Appointments.attemptCheckIn(1);
      Error.validatePageLoaded('check-in-failed-cant-file');
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots(
        'Day-of-check-in--travel-pay--check-in-error--no-mileage',
      );
    });
    it('shows the correct error message for check in failed yes to all travel', () => {
      TravelPages.validatePageLoaded();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('mileage');
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('vehicle');
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('address');
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('review');
      TravelPages.acceptTerms();
      TravelPages.attemptToGoToNextPage();
      Appointments.validatePageLoaded();
      Appointments.attemptCheckIn(1);
      Error.validatePageLoaded('check-in-failed-file-later');
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Day-of-check-in--travel-pay--check-in-error');
    });
  });
});
