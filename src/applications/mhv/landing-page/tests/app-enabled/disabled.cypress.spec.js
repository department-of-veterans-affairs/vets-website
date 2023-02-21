import manifest from '../../manifest.json';

import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(manifest.appName, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withAppDisabled();
    ApiInitializer.initializeUserData.withDefaultUser();
  });

  it('landing page is disabled', () => {
    LandingPage.visitPage();
    LandingPage.validateRedirectHappened();
  });
});
