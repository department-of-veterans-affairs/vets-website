import manifest from '../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';

describe(manifest.appName, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withAppDisabled();
    ApiInitializer.initializeUserData.withDefaultUser();
  });

  it('landing page is diasbled', () => {
    // TODO: fill in test
  });
});
