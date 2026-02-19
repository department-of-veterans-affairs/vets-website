import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

// App-level Feature Toggles

/**
 * Supports the smoke testing of MHV features by creating an allow-list of testers who can bypass
 * the MHV downtime notification in production.
 */
export const selectBypassDowntime = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvBypassDowntimeNotification];

// Domain-level Feature Toggles

export const selectFilterAndSortFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsFilterAndSort];

export const selectImagesDomainFlag = state =>
  state.featureToggles[FEATURE_FLAG_NAMES.mhvMedicalRecordsImagesDomain];

export const selectFetchScdfImagingStudies = state =>
  state.featureToggles[
    FEATURE_FLAG_NAMES.mhvMedicalRecordsFetchScdfImagingStudies
  ];

export const selectHoldTimeMessagingUpdate = state =>
  state.featureToggles[
    FEATURE_FLAG_NAMES.mhvMedicalRecordsHoldTimeMessagingUpdate
  ];
