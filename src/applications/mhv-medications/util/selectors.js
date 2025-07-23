import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const selectAllergiesFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsDisplayAllergies]; // fully enabled 2024/12/23

export const selectGroupingFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsDisplayGrouping]; // fully enabled 2025/01/29

export const selectPendingMedsFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsDisplayPendingMeds];

export const selectRefillProgressFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsDisplayRefillProgress]; // at 50% 2025/05/27

export const selectRemoveLandingPageFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsRemoveLandingPage]; // fully enabled 2025/03/12

export const selectIPEContentFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsShowIpeContent]; // fully enabled 2025/05/27

export const selectPartialFillContentFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsPartialFillContent];

export const selectDontIncrementIpeCountFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsDontIncrementIpeCount];

export const selectBypassDowntime = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvBypassDowntimeNotification];
