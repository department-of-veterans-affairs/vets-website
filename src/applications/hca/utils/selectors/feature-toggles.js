import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const selectFeatureToggles = state => {
  const toggles = toggleValues(state);
  return {
    isLoadingFeatureFlags: toggles.loading,
    isBrowserMonitoringEnabled:
      toggles[FEATURE_FLAG_NAMES.hcaBrowserMonitoringEnabled],
    isESOverrideEnabled:
      toggles[FEATURE_FLAG_NAMES.hcaEnrollmentStatusOverrideEnabled],
    isPerformanceAlertEnabled:
      toggles[FEATURE_FLAG_NAMES.hcaPerformanceAlertEnabled],
    isRegOnlyEnabled: toggles[FEATURE_FLAG_NAMES.hcaRegOnlyEnabled],
  };
};
