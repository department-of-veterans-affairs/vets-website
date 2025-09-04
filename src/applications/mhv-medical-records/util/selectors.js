import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

// App-level Feature Toggles

/** Keep these two in the same selector to prevent a race-condition when loading. */
export const flagsLoadedAndMhvEnabled = state => {
  return {
    featureTogglesLoading: state.featureToggles.loading,
    appEnabled:
      state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsToVaGovRelease],
  };
};

/**
 * Supports the smoke testing of MHV features by creating an allow-list of testers who can bypass
 * the MHV downtime notification in production.
 */
export const selectBypassDowntime = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvBypassDowntimeNotification];

export const selectMhvMrEnabledFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsToVaGovRelease];
export const selectSidenavFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplaySidenav];

// Domain-level Feature Toggles

export const selectVitalsFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayVitals];
export const selectSettingsPageFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplaySettingsPage];
export const selectMarch17UpdatesFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsUpdateLandingPage];
export const selectFilterAndSortFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsFilterAndSort];
export const selectMilestoneTwoFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsMilestoneTwo];
