import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import sharedData from '../../../api/local-mock-api/mocks/v2/shared';
import Error from './pages/Error';

describe('A Patient who has already filed for all eligile appointments', () => {
  beforeEach(() => {
    const {
      initializeFeatureToggle,
      initializeSessionGet,
      initializeSessionPost,
    } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withSuccessfulNewSession();
    initializeSessionPost.withSuccess();
  });
  it('should redirect to the correct error page after login', () => {
    ApiInitializer.initializeCheckInDataGetOH.withSuccess(
      sharedData.get.defaultUUID,
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

    Error.validatePageLoaded();
    Error.validateErrorAlert('already-filed-claim');
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Travel-claim--error-already-filed-claim');
  });
});
