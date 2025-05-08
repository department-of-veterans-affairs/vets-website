import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

export const facilitiesPpmsSuppressAll = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.facilitiesPpmsSuppressAll];

export const facilityLocatorPredictiveLocationSearch = state =>
  toggleValues(state)[
    FEATURE_FLAG_NAMES.facilityLocatorPredictiveLocationSearch
  ];

export const facilitiesUseFlProgressiveDisclosure = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.facilitiesUseFlProgressiveDisclosure];

export const facilityLocatorMobileMapUpdate = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.facilityLocatorMobileMapUpdate];

export const facilityLocatorAutosuggestVAMCServices = state =>
  toggleValues(state)[
    FEATURE_FLAG_NAMES.facilitiesAutoSuggestVAMCServicesEnabled
  ];
