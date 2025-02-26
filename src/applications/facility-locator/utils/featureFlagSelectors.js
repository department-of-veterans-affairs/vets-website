import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const facilitiesPpmsSuppressAll = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.facilitiesPpmsSuppressAll];

export const facilityLocatorPredictiveLocationSearch = state =>
  toggleValues(state)[
    FEATURE_FLAG_NAMES.facilityLocatorPredictiveLocationSearch
  ];

export const facilitiesUseAddressTypeahead = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.facilitiesUseAddressTypeahead];

export const facilitiesUseFlProgressiveDisclosure = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.facilitiesUseFlProgressiveDisclosure];

export const facilityLocatorMobileMapUpdate = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.facilityLocatorMobileMapUpdate];
