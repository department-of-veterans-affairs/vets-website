import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const selectRefillContentFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsDisplayRefillContent];

export const selectAllergiesFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsDisplayAllergies];

export const selectFilterFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsDisplayFilter];

export const selectGroupingFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsDisplayGrouping];

export const selectPendingMedsFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsDisplayPendingMeds];
