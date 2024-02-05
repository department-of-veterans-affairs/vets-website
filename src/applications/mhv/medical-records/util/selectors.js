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
export const selectMhvMrEnabledFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsToVaGovRelease];
export const selectSidenavFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplaySidenav];

// Domain-level Feature Toggles

export const selectVaccinesFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayVaccines];
export const selectNotesFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsDisplayNotes];
