import { expect } from 'chai';
import { selectFeatureToggles } from '../../../../utils/selectors';

describe('hca FeatureToggles selector', () => {
  const state = {
    featureToggles: {
      /* eslint-disable camelcase */
      hca_reg_only_enabled: true,
      hca_browser_monitoring_enabled: true,
      hca_performance_alert_enabled: false,
      hca_enrollment_status_override_enabled: false,
      loading: false,
    },
  };

  describe('when `selectFeatureToggles` executes', () => {
    it('should return feature toggles', () => {
      expect(selectFeatureToggles(state)).to.eql({
        isLoadingFeatureFlags: false,
        isBrowserMonitoringEnabled: true,
        isPerformanceAlertEnabled: false,
        isESOverrideEnabled: false,
        isRegOnlyEnabled: true,
      });
    });
  });
});
