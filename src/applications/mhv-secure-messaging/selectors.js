import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

export const folder = state => state.sm.folders.folder;
export const selectSignature = state => state.sm.preferences.signature;
export const isPilotState = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvSecureMessagingCernerPilot];
