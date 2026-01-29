import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const selectAllergiesFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsDisplayAllergies]; // fully enabled 2024/12/23

export const selectPendingMedsFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsDisplayPendingMeds];

export const selectPartialFillContentFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsPartialFillContent];

export const selectDontIncrementIpeCountFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsDontIncrementIpeCount];

export const selectBypassDowntime = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvBypassDowntimeNotification];

export const selectNewCernerFacilityAlertFlag = state =>
  state.featureToggles[
    FEATURE_FLAG_NAMES.mhvMedicationsDisplayNewCernerFacilityAlert
  ];

export const selectSecureMessagingMedicationsRenewalRequestFlag = state =>
  state.featureToggles[
    FEATURE_FLAG_NAMES.mhvSecureMessagingMedicationsRenewalRequest
  ];

export const selectCernerPilotFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot];

export const selectV2StatusMappingFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicationsV2StatusMapping];

export const selectEnableKramesHtmlSanitizationFlag = state =>
  state.featureToggles[
    FEATURE_FLAG_NAMES.mhvMedicationsEnableKramesHtmlSanitization
  ];
