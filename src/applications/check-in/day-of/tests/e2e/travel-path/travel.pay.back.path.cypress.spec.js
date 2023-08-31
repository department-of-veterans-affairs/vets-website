import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Appointments from '../pages/Appointments';
import TravelPages from '../../../../tests/e2e/pages/TravelPages';
import Arrived from '../pages/Arrived';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';

describe('Check In Experience', () => {
  describe('travel pay back path', () => {
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
      initializeCheckInDataPost.withSuccess();
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
    it('routes back to the first page if no from appointments', () => {
      TravelPages.validatePageLoaded();
      TravelPages.attemptToGoToNextPage('no');
      Appointments.validatePageLoaded();
      cy.get(`[data-testid="back-button"]`).click();
      TravelPages.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
    it('routes back to the second page(mileage) if no from appointments', () => {
      TravelPages.validatePageLoaded();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('mileage');
      TravelPages.attemptToGoToNextPage('no');
      Appointments.validatePageLoaded();
      cy.get(`[data-testid="back-button"]`).click();
      TravelPages.validatePageLoaded('mileage');
      cy.injectAxeThenAxeCheck();
    });
    it('routes back to the third page (vehicle) if no from appointments', () => {
      TravelPages.validatePageLoaded();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('mileage');
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('vehicle');
      TravelPages.attemptToGoToNextPage('no');
      Appointments.validatePageLoaded();
      cy.get(`[data-testid="back-button"]`).click();
      TravelPages.validatePageLoaded('vehicle');
      cy.injectAxeThenAxeCheck();
    });
    it('routes back to the fourth page (address) if no from appointments', () => {
      TravelPages.validatePageLoaded();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('mileage');
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('vehicle');
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('address');
      TravelPages.attemptToGoToNextPage('no');
      Appointments.validatePageLoaded();
      cy.get(`[data-testid="back-button"]`).click();
      TravelPages.validatePageLoaded('address');
      cy.injectAxeThenAxeCheck();
    });
  });
});
