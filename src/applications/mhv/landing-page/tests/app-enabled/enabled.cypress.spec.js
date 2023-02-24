import manifest from '../../manifest.json';

import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(manifest.appName, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
    ApiInitializer.initializeUserData.withDefaultUser();
  });

  it('landing page is enabled', () => {
    LandingPage.visitPage();
    LandingPage.validatePageLoaded();
    LandingPage.validateURL();
    cy.injectAxeThenAxeCheck();
  });
});
