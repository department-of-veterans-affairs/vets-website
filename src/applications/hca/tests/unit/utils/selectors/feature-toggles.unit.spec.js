import { expect } from 'chai';
import { selectFeatureToggles } from '../../../../utils/selectors/feature-toggles';

describe('hca FeatureToggles selector', () => {
  const state = {
    featureToggles: {
      /* eslint-disable camelcase */
      hca_sigi_enabled: false,
      hca_reg_only_enabled: true,
      hca_insurance_v2_enabled: false,
      hca_browser_monitoring_enabled: true,
      hca_enrollment_status_override_enabled: false,
      hca_use_facilities_API: false,
      loading: false,
    },
  };

  describe('when `selectFeatureToggles` executes', () => {
    it('should return feature toggles', () => {
      expect(selectFeatureToggles(state)).to.eql({
        isLoadingFeatureFlags: false,
        isBrowserMonitoringEnabled: true,
        isESOverrideEnabled: false,
        isInsuranceV2Enabled: false,
        isRegOnlyEnabled: true,
        isSigiEnabled: false,
      });
    });
  });
});
