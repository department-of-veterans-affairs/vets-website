import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import TravelIntro from './pages/TravelIntro';

describe('A patent who returns to the app with a valid session ', () => {
  beforeEach(() => {
    const {
      initializeFeatureToggle,
      initializeSessionGet,
      initializeCheckInDataGetOH,
      initializeCheckInDataPost,
    } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withSuccessfulReturningSession();
    initializeCheckInDataGetOH.withSuccess();
    initializeCheckInDataPost.withSuccess();
  });
  it('should be redirected to the travel intro screen with data loaded', () => {
    cy.visitTravelClaimWithUUID();
    TravelIntro.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
  });
});
