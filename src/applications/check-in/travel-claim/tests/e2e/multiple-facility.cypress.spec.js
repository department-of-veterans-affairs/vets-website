import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import TravelIntro from './pages/TravelIntro';
import TravelMileage from './pages/TravelMileage';
import TravelPages from '../../../tests/e2e/pages/TravelPages';
import TravelComplete from './pages/TravelComplete';
import sharedData from '../../../api/local-mock-api/mocks/v2/shared';

describe('A patient with appointments at multiple facilities', () => {
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
    initializeBtsssPost.withSuccess(2);
  });
  it('should successfully file a travel claim for a single facility', () => {
    ApiInitializer.initializeCheckInDataGetOH.withSuccess(
      sharedData.get.multiApptMultiFacilityUUID,
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
    TravelMileage.selectFacility('500');
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
      sharedData.get.multiApptMultiFacilityUUID,
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
    TravelMileage.validateFacilityCount(3);
    TravelMileage.selectFacility('500');
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
    TravelMileage.selectFacility('500');
    TravelMileage.selectFacility('530');
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
  it('should successfully file a travel claim for multiple facilities', () => {
    ApiInitializer.initializeCheckInDataGetOH.withSuccess(
      sharedData.get.multiApptMultiFacilityUUID,
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
    TravelMileage.selectFacility('500');
    TravelMileage.selectFacility('530');
    cy.createScreenshots('Travel-claim--multiple-facilities--Mileage');
    TravelMileage.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-vehicle-page');
    cy.injectAxeThenAxeCheck();
    TravelPages.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-address-page');
    cy.injectAxeThenAxeCheck();
    TravelPages.attemptToGoToNextPage();

    TravelPages.validatePageWrapper('travel-claim-review-page');
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Travel-claim--multiple-facilities--Review');
    TravelPages.acceptTerms();
    TravelPages.attemptToGoToNextPage();

    TravelComplete.validatePageLoaded();
    TravelComplete.validateContent('multi-claim-multi-appointment');
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Travel-claim--multiple-facilities--Complete');
  });
  it('should successfully file a travel claim for one facility when there are three and one other one is already filed', () => {
    ApiInitializer.initializeCheckInDataGetOH.withSuccess(
      sharedData.get.multiApptMultiFacilityUUID,
    );
    cy.visitTravelClaimWithUUID();
    cy.window().then(win => {
      // Set the value in local storage using win.localStorage.setItem()
      win.localStorage.setItem(
        'my.health.travel-claim.travel.pay.sent',
        `{"530":"${new Date().toISOString()}"}`,
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
    TravelMileage.validateContext.multiFacility();
    cy.injectAxeThenAxeCheck();
    TravelMileage.validateFacilityCount(2);
    TravelMileage.selectFacility('500');
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
  it('should successfully file a travel claim for one facility when there are two and one is already filed', () => {
    ApiInitializer.initializeCheckInDataGetOH.withSuccess(
      sharedData.get.multiApptTwoFacilityUUID,
    );
    cy.visitTravelClaimWithUUID();
    cy.window().then(win => {
      // Set the value in local storage using win.localStorage.setItem()
      win.localStorage.setItem(
        'my.health.travel-claim.travel.pay.sent',
        `{"530":"${new Date().toISOString()}"}`,
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
    TravelMileage.validateContext.singleFacility();
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
    TravelComplete.validateContent('single-claim-single-appointment');
    cy.injectAxeThenAxeCheck();
  });
  it('should successfully file a travel claim after going back from the review page and changing the facility', () => {
    ApiInitializer.initializeCheckInDataGetOH.withSuccess(
      sharedData.get.multiApptMultiFacilityUUID,
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
    TravelMileage.validateFacilityCount(3);
    TravelMileage.selectFacility('500');
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
    TravelMileage.validateFacilityCount(3);
    TravelMileage.selectFacility('530');
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
      sharedData.get.multiApptMultiFacilityUUID,
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
    TravelMileage.validateFacilityCount(3);
    TravelMileage.selectFacility('500');
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
