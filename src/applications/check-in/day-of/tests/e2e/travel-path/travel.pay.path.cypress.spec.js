import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Appointments from '../pages/Appointments';
import TravelPages from '../../../../tests/e2e/pages/TravelPages';

describe('Check In Experience', () => {
  describe('update skip path', () => {
    beforeEach(() => {
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
        numberOfCheckInAbledAppointments: 1,
      });
      initializeCheckInDataPost.withSuccess();
      cy.visitWithUUID();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('visits all pages including travel pay pages.', () => {
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
    });
  });
});
