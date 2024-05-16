import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const selectRefillContentFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsDisplayRefillContent];
