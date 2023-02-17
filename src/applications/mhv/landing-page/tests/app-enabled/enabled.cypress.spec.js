import manifest from '../../manifest.json';
import ApiInitializer from '../utilities/ApiInitializer';

describe(manifest.appName, () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withCurrentFeatures();
    ApiInitializer.initializeUserData.withDefaultUser();
  });

  it('landing page is enabled', () => {
    // TODO: fill in test
  });
});
