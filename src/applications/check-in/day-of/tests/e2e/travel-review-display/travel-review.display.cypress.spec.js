import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import TravelPages from '../../../../tests/e2e/pages/TravelPages';

describe('Check In Experience', () => {
  describe('travel review display', () => {
    const appointments = [{ startTime: '2021-08-19T03:00:00' }];
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
        appointments,
      });
      initializeCheckInDataPost.withSuccess();
      cy.visitWithUUID();
      ValidateVeteran.validatePage.dayOf();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      Demographics.validatePageLoaded();
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.validatePageLoaded(
        'Check-In Is this your current next of kin information?',
      );
      NextOfKin.attemptToGoToNextPage();
      TravelPages.validatePageLoaded();
      TravelPages.validateContent();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('vehicle');
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('address');
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('mileage');
      TravelPages.attemptToGoToNextPage();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('renders the travel review page with content', () => {
      TravelPages.validatePageLoaded('review');
      TravelPages.validateContent('review');
      TravelPages.validateBackButton('review');
      cy.injectAxeThenAxeCheck();
    });
    it('edit takes you back to the vehicle question', () => {
      TravelPages.validatePageLoaded('review');
      TravelPages.clickEditLink();
      TravelPages.validatePageLoaded('vehicle');
      cy.injectAxeThenAxeCheck();
    });
    it('must agree to terms', () => {
      TravelPages.validatePageLoaded('review');
      TravelPages.attemptToGoToNextPage();
      TravelPages.checkForValidationError();
      cy.injectAxeThenAxeCheck();
    });
  });
});
