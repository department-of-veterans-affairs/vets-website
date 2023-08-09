import manifest from '../../manifest.json';

import ApiInitializer from '../utilities/ApiInitializer';
import LandingPage from '../pages/LandingPage';

describe(manifest.appName, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withAppDisabled();
    ApiInitializer.initializeUserData.withDefaultUser();
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('landing page is disabled', () => {
    LandingPage.validateRedirectHappens();
    LandingPage.visitPage();
  });
});
