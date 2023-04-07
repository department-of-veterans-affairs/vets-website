import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const facilitiesPpmsSuppressAll = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.facilitiesPpmsSuppressAll];

export const facilitiesPpmsSuppressPharmacies = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.facilitiesPpmsSuppressPharmacies];

export const facilitiesPpmsSuppressCommunityCare = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.facilitiesPpmsSuppressCommunityCare];

export const facilityLocatorPredictiveLocationSearch = state =>
  toggleValues(state)[
    FEATURE_FLAG_NAMES.facilityLocatorPredictiveLocationSearch
  ];

export const facilityLocatorShowOperationalHoursSpecialInstructions = state =>
  toggleValues(state)[
    FEATURE_FLAG_NAMES.facilityLocatorShowOperationalHoursSpecialInstructions
  ];

export const facilityLocatorLatLongOnly = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.facilityLocatorLatLongOnly];

export const facilityLocatorRestoreCommunityCarePagination = state =>
  toggleValues(state)[
    FEATURE_FLAG_NAMES.facilityLocatorRestoreCommunityCarePagination
  ];
