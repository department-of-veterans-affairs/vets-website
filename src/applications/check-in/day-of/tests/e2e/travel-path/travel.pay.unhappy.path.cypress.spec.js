import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Confirmation from '../pages/Confirmation';
import Appointments from '../pages/Appointments';
import TravelPages from '../../../../tests/e2e/pages/TravelPages';

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
        initializeBtsssPost,
      } = ApiInitializer;
      initializeFeatureToggle.withTravelPay();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeDemographicsPatch.withSuccess();
      initializeCheckInDataGet.withSuccess({
        numberOfCheckInAbledAppointments: 1,
        appointments,
      });
      initializeCheckInDataPost.withSuccess();
      initializeBtsssPost.withFailure();
      cy.visitWithUUID();
      ValidateVeteran.validatePage.dayOf();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      Demographics.validatePageLoaded();
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.validatePageLoaded(
        'Is this your current next of kin information?',
      );
      NextOfKin.attemptToGoToNextPage();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('shows the correct error message for an api error.', () => {
      TravelPages.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Day-of-check-in--travel-pay--travel-question');
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('vehicle');
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Day-of-check-in--travel-pay--vehicle-question');
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('address');
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Day-of-check-in--travel-pay--address-question');
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('mileage');
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Day-of-check-in--travel-pay--mileage-question');
      TravelPages.attemptToGoToNextPage();
      Appointments.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Appointments.attemptCheckIn(1);
      Confirmation.validatePageLoadedWithBtsssSubmissionFailure();
      cy.injectAxeThenAxeCheck();
    });
  });
});
