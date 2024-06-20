import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import TravelIntro from './pages/TravelIntro';
import TravelMileage from './pages/TravelMileage';
import TravelPages from '../../../tests/e2e/pages/TravelPages';
import sharedData from '../../../api/local-mock-api/mocks/v2/shared';
import Error from './pages/Error';

describe('A Patient that encounters an error when submitting for a travel claim', () => {
  beforeEach(() => {
    const {
      initializeFeatureToggle,
      initializeSessionGet,
      initializeSessionPost,
      initializeCheckInDataGetOH,
      initializeBtsssPost,
    } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withSuccessfulNewSession();
    initializeSessionPost.withSuccess();
    initializeCheckInDataGetOH.withSuccess(sharedData.get.defaultUUID);
    initializeBtsssPost.withFailure(1);
  });
  it('should see the correct error page', () => {
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

    Error.validatePageLoaded();
    Error.validateErrorAlert('completing-travel-submission');
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Travel-claim--error-completing-travel-submission');
  });
});
