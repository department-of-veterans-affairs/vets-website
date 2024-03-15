import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import TravelIntro from './pages/TravelIntro';
import TravelMileage from './pages/TravelMileage';
import TravelPages from '../../../tests/e2e/pages/TravelPages';
import TravelComplete from './pages/TravelComplete';
import sharedData from '../../../api/local-mock-api/mocks/v2/shared';

describe('A Patient with appointments at one facility', () => {
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
      sharedData.get.defaultUUID,
    );
    cy.visitTravelClaimWithUUID();
    ValidateVeteran.validatePage.travelClaim();
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Travel-claim--Validate');
    ValidateVeteran.validateVeteran();
    ValidateVeteran.attemptToGoToNextPage();

    TravelIntro.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Travel-claim--Intro');
    TravelIntro.attemptToGoToNextPage();

    TravelMileage.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Travel-claim--Mileage');
    TravelMileage.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-vehicle-page');
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Travel-claim--Vehicle');
    TravelPages.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-address-page');
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Travel-claim--Address');
    TravelPages.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-review-page');
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Travel-claim--Review');
    TravelPages.acceptTerms();
    TravelPages.attemptToGoToNextPage();

    TravelComplete.validatePageLoaded();
    TravelComplete.validateContent('single-claim-single-appointment');
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots(
      'Travel-claim--single-claim-single-appointment--Complete',
    );
  });
  it('should successfully file a travel claim for multiple appointments', () => {
    ApiInitializer.initializeCheckInDataGetOH.withSuccess(
      sharedData.get.multiApptSingleFacilityUUID,
    );
    cy.visitTravelClaimWithUUID();
    ValidateVeteran.validatePage.travelClaim();
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Travel-claim--Validate');
    ValidateVeteran.validateVeteran();
    ValidateVeteran.attemptToGoToNextPage();

    TravelIntro.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Travel-claim--Intro');
    TravelIntro.attemptToGoToNextPage();

    TravelMileage.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Travel-claim--Mileage');
    TravelMileage.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-vehicle-page');
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Travel-claim--Vehicle');
    TravelPages.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-address-page');
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Travel-claim--Address');
    TravelPages.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-review-page');
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Travel-claim--Review');
    TravelPages.acceptTerms();
    TravelPages.attemptToGoToNextPage();

    TravelComplete.validatePageLoaded();
    TravelComplete.validateContent('single-claim-multi-appointments');
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots(
      'Travel-claim--single-claim-multiple-appointments--Complete',
    );
  });
});
