import { expect } from 'chai';
import { makeSelectFeatureToggles } from '../../../selectors/feature-toggles';

describe('10-10d RUM FeatureToggles selector', () => {
  const state = {
    featureToggles: {
      /* eslint-disable camelcase */
      form1010d_browser_monitoring_enabled: true,
      loading: false,
    },
  };

  describe('when `makeSelectFeatureToggles` executes', () => {
    it('should return feature toggles', () => {
      const selectFeatureToggles = makeSelectFeatureToggles();
      expect(selectFeatureToggles(state)).to.eql({
        isLoadingFeatureFlags: false,
        isBrowserMonitoringEnabled: true,
      });
    });
  });
});
