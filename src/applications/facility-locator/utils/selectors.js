import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const facilitiesPpmsSuppressPharmacies = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.facilitiesPpmsSuppressPharmacies];

export const facilitiesPpmsSuppressCommunityCare = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.facilitiesPpmsSuppressCommunityCare];

export const facilityLocatorPredictiveLocationSearch = state =>
  toggleValues(state)[
    FEATURE_FLAG_NAMES.facilityLocatorPredictiveLocationSearch
  ];

export const facilityLocatorLighthouseCovidVaccineQuery = state =>
  toggleValues(state)[
    FEATURE_FLAG_NAMES.facilityLocatorLighthouseCovidVaccineQuery
  ];

export const facilityLocatorShowOperationalHoursSpecialInstructions = state =>
  toggleValues(state)[
    FEATURE_FLAG_NAMES.facilityLocatorShowOperationalHoursSpecialInstructions
  ];
