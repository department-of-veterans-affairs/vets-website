import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const facilitiesPpmsSuppressAll = () => true;
// TODO: remove hard-wired value and replace with this to test the feature flag in staging:
// toggleValues(state)[FEATURE_FLAG_NAMES.facilitiesPpmsSuppressAll];

export const facilitiesPpmsSuppressPharmacies = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.facilitiesPpmsSuppressPharmacies];

export const facilitiesPpmsSuppressCommunityCare = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.facilitiesPpmsSuppressCommunityCare];

export const facilityLocatorCovidVaccineWalkInAvailabilityTextFrontend = state =>
  toggleValues(state)[
    FEATURE_FLAG_NAMES.facilityLocatorCovidVaccineWalkInAvailabilityTextFrontend
  ];
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

export const covidVaccineSchedulingFrontend = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.covidVaccineSchedulingFrontend];

export const facilityLocatorRailsEngine = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.facilityLocatorRailsEngine];
