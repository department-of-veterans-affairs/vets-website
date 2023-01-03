import { expect } from 'chai';
import { makeSelectFeatureToggles } from '../../../utils/selectors/feature-toggles';

describe('HCA Selectors', () => {
  const state = {
    featureToggles: {
      /* eslint-disable camelcase */
      caregiver_sigi_enabled: false,
      hca_american_indian_enabled: true,
      hca_browser_monitoring_enabled: true,
      hca_enrollment_status_override_enabled: false,
      hca_short_form_enabled: true,
      hca_use_facilities_API: false,
      loading: false,
    },
  };

  describe('makeSelectFeatureToggles', () => {
    it('returns feature toggles', () => {
      const selectFeatureToggles = makeSelectFeatureToggles();
      expect(selectFeatureToggles(state)).to.eql({
        isLoadingFeatureFlags: false,
        isAiqEnabled: true,
        isBrowserMonitoringEnabled: true,
        isESOverrideEnabled: false,
        isFacilitiesApiEnabled: false,
        isShortFormEnabled: true,
        isSigiEnabled: false,
      });
    });
  });
});
