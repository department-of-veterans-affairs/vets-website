import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import TravelIntro from './pages/TravelIntro';
import TravelMileage from './pages/TravelMileage';
import TravelPages from '../../../tests/e2e/pages/TravelPages';
import TravelComplete from './pages/TravelComplete';
import sharedData from '../../../api/local-mock-api/mocks/v2/shared';

describe('A patient with multiple appointments', () => {
  beforeEach(() => {
    const {
      initializeFeatureToggle,
      initializeSessionGet,
      initializeSessionPost,
      initializeBtsssPost,
    } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withSuccessfulNewSession();
    initializeSessionPost.withSuccess();
    initializeBtsssPost.withSuccess();
  });
  it('should successfully file a travel claim for a single appointment', () => {
    ApiInitializer.initializeCheckInDataGetOH.withSuccess(
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

    TravelMileage.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
    TravelMileage.selectAppointment('500-1111');
    TravelMileage.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-vehicle-page');
    cy.injectAxeThenAxeCheck();
    TravelPages.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-address-page');
    cy.injectAxeThenAxeCheck();
    TravelPages.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-review-page');
    cy.injectAxeThenAxeCheck();
    TravelPages.acceptTerms();
    TravelPages.attemptToGoToNextPage();

    TravelComplete.validatePageLoaded();
    TravelComplete.validateContent('single-claim-multi-appointment');
    cy.injectAxeThenAxeCheck();
  });
  it('should successfully file a travel claim after going back by clicking start over to change the facility', () => {
    ApiInitializer.initializeCheckInDataGetOH.withSuccess(
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

    TravelMileage.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
    TravelMileage.validateAppointmentCount(2);
    TravelMileage.selectAppointment('500-1111');
    TravelMileage.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-vehicle-page');
    cy.injectAxeThenAxeCheck();
    TravelPages.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-address-page');
    cy.injectAxeThenAxeCheck();
    TravelPages.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-review-page');
    cy.injectAxeThenAxeCheck();
    TravelPages.acceptTerms();
    TravelPages.clickBackButton();

    TravelMileage.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
    TravelMileage.selectAppointment('500-2222');
    TravelMileage.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-vehicle-page');
    cy.injectAxeThenAxeCheck();
    TravelPages.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-address-page');
    cy.injectAxeThenAxeCheck();
    TravelPages.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-review-page');
    cy.injectAxeThenAxeCheck();
    TravelPages.acceptTerms();
    TravelPages.attemptToGoToNextPage();

    TravelComplete.validatePageLoaded();
    TravelComplete.validateContent('single-claim-multi-appointment');
  });
  it('should successfully file a travel claim after going back from the review page and changing the appointment', () => {
    ApiInitializer.initializeCheckInDataGetOH.withSuccess(
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

    TravelMileage.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
    TravelMileage.validateAppointmentCount(2);
    TravelMileage.selectAppointment('500-1111');
    TravelMileage.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-vehicle-page');
    cy.injectAxeThenAxeCheck();
    TravelPages.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-address-page');
    cy.injectAxeThenAxeCheck();
    TravelPages.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-review-page');
    cy.injectAxeThenAxeCheck();
    TravelPages.acceptTerms();
    TravelPages.goBack();
    TravelPages.goBack();
    TravelPages.goBack();

    TravelMileage.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
    TravelMileage.validateAppointmentCount(2);
    TravelMileage.selectAppointment('500-2222');
    TravelMileage.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-vehicle-page');
    cy.injectAxeThenAxeCheck();
    TravelPages.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-address-page');
    cy.injectAxeThenAxeCheck();
    TravelPages.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-review-page');
    cy.injectAxeThenAxeCheck();
    TravelPages.acceptTerms();
    TravelPages.attemptToGoToNextPage();

    TravelComplete.validatePageLoaded();
    TravelComplete.validateContent('multi-claim-multi-appointment');
    cy.injectAxeThenAxeCheck();
  });
  it('should successfully file a travel claim after viewing the travel agreement', () => {
    ApiInitializer.initializeCheckInDataGetOH.withSuccess(
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

    TravelMileage.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
    TravelMileage.validateAppointmentCount(2);
    TravelMileage.selectAppointment('500-1111');
    TravelMileage.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-vehicle-page');
    cy.injectAxeThenAxeCheck();
    TravelPages.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-address-page');
    cy.injectAxeThenAxeCheck();
    TravelPages.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-review-page');
    cy.injectAxeThenAxeCheck();
    TravelPages.acceptTerms();
    TravelPages.clickAgreementLink();
    TravelPages.validateAgreementPage();
    TravelPages.goBack();
    TravelPages.acceptTerms();
    TravelPages.attemptToGoToNextPage();

    TravelComplete.validatePageLoaded();
    TravelComplete.validateContent('single-claim-multi-appointment');
    cy.injectAxeThenAxeCheck();
  });
});
