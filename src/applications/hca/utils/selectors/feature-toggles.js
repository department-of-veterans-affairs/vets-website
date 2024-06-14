import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

export const selectFeatureToggles = state => {
  const toggles = toggleValues(state);
  return {
    isLoadingFeatureFlags: toggles.loading,
    isBrowserMonitoringEnabled:
      toggles[FEATURE_FLAG_NAMES.hcaBrowserMonitoringEnabled],
    isESOverrideEnabled:
      toggles[FEATURE_FLAG_NAMES.hcaEnrollmentStatusOverrideEnabled],
    isFacilitiesApiEnabled: toggles[FEATURE_FLAG_NAMES.hcaUseFacilitiesApi],
    isSigiEnabled: toggles[FEATURE_FLAG_NAMES.hcaSigiEnabled],
  };
};
