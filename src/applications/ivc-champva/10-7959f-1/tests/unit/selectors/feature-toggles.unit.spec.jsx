import { expect } from 'chai';
import { makeSelectFeatureToggles } from '../../../selectors/feature-toggles';

describe('10-7959f-1 RUM FeatureToggles selector', () => {
  const state = {
    featureToggles: {
      /* eslint-disable camelcase */
      form107959f1_browser_monitoring_enabled: true,
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
