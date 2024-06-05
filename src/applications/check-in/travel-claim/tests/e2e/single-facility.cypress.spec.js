import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import TravelIntro from './pages/TravelIntro';
import TravelMileage from './pages/TravelMileage';
import TravelPages from '../../../tests/e2e/pages/TravelPages';
import TravelComplete from './pages/TravelComplete';
import sharedData from '../../../api/local-mock-api/mocks/v2/shared';

const dateFns = require('date-fns');
// skipping rather than fixing since this will be overhauled.
describe.skip('A Patient with appointments at one facility', () => {
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
    cy.createScreenshots(
      'Travel-claim--single-claim-single-appointment--Mileage',
    );
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
    cy.createScreenshots(
      'Travel-claim--single-claim-single-appointment--Review',
    );
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
    ValidateVeteran.validateVeteran();
    ValidateVeteran.attemptToGoToNextPage();

    TravelIntro.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
    TravelIntro.attemptToGoToNextPage();

    TravelMileage.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots(
      'Travel-claim--single-claim-mulitple-appointments--Mileage',
    );
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
    TravelComplete.validateContent('single-claim-multi-appointments');
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots(
      'Travel-claim--single-claim-multiple-appointments--Complete',
    );
  });
  it('should successfully file a travel claim for a single appointment the day after the same facility was already filed', () => {
    ApiInitializer.initializeCheckInDataGetOH.withSuccess(
      sharedData.get.defaultUUID,
    );
    cy.visitTravelClaimWithUUID();
    cy.window().then(win => {
      // Set the value in local storage using win.localStorage.setItem()
      win.localStorage.setItem(
        'my.health.travel-claim.travel.pay.sent',
        `{"530":"${dateFns.sub(new Date(), { days: -1 }).toISOString()}"}`,
      );
    });
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

    TravelComplete.validatePageLoaded();
    TravelComplete.validateContent('single-claim-multi-appointments');
    cy.injectAxeThenAxeCheck();
  });
});
