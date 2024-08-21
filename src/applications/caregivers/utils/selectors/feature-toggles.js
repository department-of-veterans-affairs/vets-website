import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const selectFeatureToggles = state => {
  const toggles = toggleValues(state);
  return {
    isLoadingFeatureFlags: toggles.loading,
    isBrowserMonitoringEnabled:
      toggles[FEATURE_FLAG_NAMES.caregiverBrowserMonitoringEnabled],
    useFacilitiesApi: toggles[FEATURE_FLAG_NAMES.caregiverUseFacilitiesApi],
  };
};
