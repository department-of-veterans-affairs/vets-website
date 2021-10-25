import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const checkInExperienceEnabled = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.checkInExperienceEnabled];

export const checkInExperienceMultipleAppointmentEnabled = state =>
  toggleValues(state)[
    FEATURE_FLAG_NAMES.checkInExperienceMultipleAppointmentEnabled
  ];

export const checkInExperienceUpdateInformationPageEnabled = state =>
  toggleValues(state)[
    FEATURE_FLAG_NAMES.checkInExperienceUpdateInformationPageEnabled
  ];

export const checkInExperienceDemographicsPageEnabled = state =>
  toggleValues(state)[
    FEATURE_FLAG_NAMES.checkInExperienceDemographicsPageEnabled
  ];

export const checkInExperienceNextOfKinEnabled = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.checkInExperienceNextOfKinEnabled];

export const loadingFeatureFlags = state => state?.featureToggles?.loading;
