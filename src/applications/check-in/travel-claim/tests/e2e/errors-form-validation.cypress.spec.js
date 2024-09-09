import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import TravelIntro from './pages/TravelIntro';
import TravelMileage from './pages/TravelMileage';
import TravelPages from '../../../tests/e2e/pages/TravelPages';
import sharedData from '../../../api/local-mock-api/mocks/v2/shared';
import Error from './pages/Error';

describe('Travel claim validation', () => {
  beforeEach(() => {
    const {
      initializeFeatureToggle,
      initializeSessionGet,
      initializeSessionPost,
      initializeCheckInDataGetOH,
    } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withSuccessfulNewSession();
    initializeSessionPost.withSuccess();
    initializeCheckInDataGetOH.withSuccess(
      sharedData.get.multiOHAppointmentsUUID,
    );
    cy.visitTravelClaimWithUUID();
    ValidateVeteran.validatePage.travelClaim();
    cy.injectAxeThenAxeCheck();
    ValidateVeteran.validateVeteran();
    ValidateVeteran.attemptToGoToNextPage();

    TravelIntro.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
    TravelIntro.attemptToGoToNextPage();
  });
  describe('A patient that answers no to travel questions', () => {
    it('should go to error page if answers no to travel vehicle', () => {
      TravelMileage.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      TravelMileage.selectAppointment('500-1111');
      TravelMileage.attemptToGoToNextPage();

      TravelPages.validatePageWrapper('travel-claim-vehicle-page');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage('no');

      Error.validatePageLoaded();
      Error.validateErrorAlert('cant-file-claim-type');
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Travel-claim--error-no-to-travel-vehicle');
    });
    it('should go to error page if answers no to travel address', () => {
      TravelMileage.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      TravelMileage.selectAppointment('500-1111');
      TravelMileage.attemptToGoToNextPage();

      TravelPages.validatePageWrapper('travel-claim-vehicle-page');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage('yes');

      TravelPages.validatePageWrapper('travel-claim-address-page');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage('no');

      Error.validatePageLoaded();
      Error.validateErrorAlert('cant-file-claim-type');
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Travel-claim--error-no-to-travel-address');
    });
    it('should go to error page if answers no to travel address after coming back from the review page', () => {
      TravelMileage.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      TravelMileage.selectAppointment('500-1111');
      TravelMileage.attemptToGoToNextPage();

      TravelPages.validatePageWrapper('travel-claim-vehicle-page');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage('yes');

      TravelPages.validatePageWrapper('travel-claim-address-page');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage('yes');

      TravelPages.validatePageWrapper('travel-claim-review-page');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage('no');

      TravelPages.validatePageWrapper('travel-mileage-page');
      cy.injectAxeThenAxeCheck();
      TravelPages.clickContinueButton('yes');

      TravelPages.validatePageWrapper('travel-claim-vehicle-page');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage('no');

      Error.validatePageLoaded();
      Error.validateErrorAlert('cant-file-claim-type');
      cy.injectAxeThenAxeCheck();
    });
  });
  describe('A patient who does not click the checkbox for the travel agreement', () => {
    it('should display an error on the page', () => {
      TravelMileage.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      TravelMileage.selectAppointment('500-1111');
      TravelMileage.attemptToGoToNextPage();

      TravelPages.validatePageWrapper('travel-claim-vehicle-page');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage('yes');

      TravelPages.validatePageWrapper('travel-claim-address-page');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage('yes');

      TravelPages.validatePageWrapper('travel-claim-review-page');
      TravelPages.attemptToGoToNextPage('yes');
      TravelPages.checkForValidationError();
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots(
        'Travel-claim--error-travel-agreement-checkbox-validation',
      );
    });
  });
  describe('A patient who attempts to click continue from facility selection without checking at least one facility', () => {
    it('should display an error on the page', () => {
      TravelMileage.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      TravelMileage.attemptToGoToNextPage();
      TravelMileage.checkForValidationError();
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Travel-claim--error-facility-selection-validation');
    });
  });
});
