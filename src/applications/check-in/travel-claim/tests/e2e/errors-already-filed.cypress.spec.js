import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import sharedData from '../../../api/local-mock-api/mocks/v2/shared';
import Error from './pages/Error';

// skipping rather than fixing since this will be overhauled.
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
  it('should redirect to the correct error page before login', () => {
    ApiInitializer.initializeCheckInDataGetOH.withSuccess(
      sharedData.get.defaultUUID,
    );
    cy.window().then(win => {
      // Set the value in local storage using win.localStorage.setItem()
      win.localStorage.setItem(
        'my.health.travel-claim.travel.pay.sent',
        JSON.stringify(new Date().toISOString()),
      );
    });
    cy.visitTravelClaimWithUUID();
    Error.validatePageLoaded();
    Error.validateErrorAlert('already-filed-claim');
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Travel-claim--error-already-filed-claim');
  });
});
