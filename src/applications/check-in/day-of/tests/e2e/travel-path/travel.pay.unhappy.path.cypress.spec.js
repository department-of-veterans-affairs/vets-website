import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Appointments from '../pages/Appointments';
import TravelPages from '../../../../tests/e2e/pages/TravelPages';
import Error from '../pages/Error';

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
      initializeCheckInDataPost.withFailure();
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
    it('shows the ineligible BTSSS message.', () => {
      TravelPages.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('vehicle');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('address');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('mileage');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage('no');
      Appointments.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Appointments.attemptCheckIn(1);
      Error.validatePageLoaded('check-in-failed-cant-file', 'en');
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Day-of-check-in--travel-pay--btsss-generic-error');
    });
    it('shows the did not send BTSSS message.', () => {
      TravelPages.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('vehicle');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('address');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('mileage');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();
      Appointments.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Appointments.attemptCheckIn(1);
      Error.validatePageLoaded('check-in-failed-file-later');
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots(
        'Day-of-check-in--travel-pay--btsss-travel-claim-exists',
      );
    });
    it('shows the default BTSSS message.', () => {
      TravelPages.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage('no');
      Appointments.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Appointments.attemptCheckIn(1);
      Error.validatePageLoaded('check-in-failed-find-out');
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots(
        'Day-of-check-in--travel-pay--btsss-travel-claim-exists',
      );
    });
  });
});
