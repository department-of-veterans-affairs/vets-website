import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const selectRefillContentFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsDisplayRefillContent];

export const selectAllergiesFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsDisplayAllergies];

export const selectGroupingFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsDisplayGrouping];

export const selectPendingMedsFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsDisplayPendingMeds];

export const selectRefillProgressFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsDisplayRefillProgress];

export const selectIPEContentFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsShowIpeContent];

export const selectPartialFillContentFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsPartialFillContent];

export const selectDontIncrementIpeCountFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsDontIncrementIpeCount];

export const selectBypassDowntime = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvBypassDowntimeNotification];
