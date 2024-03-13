import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import TravelIntro from './pages/TravelIntro';
import TravelMileage from './pages/TravelMileage';
import TravelPages from '../../../tests/e2e/pages/TravelPages';
import TravelComplete from './pages/TravelComplete';
import sharedData from '../../../api/local-mock-api/mocks/v2/shared';

describe('Single Facility Travel Claim', () => {
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
    initializeCheckInDataGetOH.withSuccess(sharedData.get.defaultUUID);
  });
  it('should successfully file a travel claim for a patient with a single appointment', () => {
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

    TravelPages.validatePageLoaded('vehicle');
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Travel-claim--Vehicle');
    TravelPages.attemptToGoToNextPage();

    TravelPages.validatePageLoaded('address');
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Travel-claim--Address');
    TravelPages.attemptToGoToNextPage();

    TravelPages.validatePageLoaded('review');
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Travel-claim--Review');
    TravelPages.acceptTerms();
    TravelPages.attemptToGoToNextPage();

    TravelComplete.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Travel-claim--Complete');
  });
});
