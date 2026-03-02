import { expect } from 'chai';
import { makeSelectFeatureToggles } from '../../../../utils/selectors/feature-toggles';

describe('ezr FeatureToggles selector', () => {
  const state = {
    featureToggles: {
      /* eslint-disable camelcase */
      ezr_browser_monitoring_enabled: true,
      ezr_upload_enabled: true,
      ezr_emergency_contacts_enabled: true,
      loading: false,
    },
  };

  describe('when `makeSelectFeatureToggles` executes', () => {
    it('should return feature toggles', () => {
      const selectFeatureToggles = makeSelectFeatureToggles();
      expect(selectFeatureToggles(state)).to.eql({
        isLoadingFeatureFlags: false,
        isBrowserMonitoringEnabled: true,
        isUploadEnabled: true,
        isEmergencyContactsEnabled: true,
      });
    });
  });
});
