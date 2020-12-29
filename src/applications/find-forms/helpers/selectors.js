// import the toggleValues helper
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const getFindFormsAppState = state => state.findVAFormsReducer;

export const mvpEnhancements = state =>
  toggleValues(state)[
    FEATURE_FLAG_NAMES.showFindFormsResultsLinkToFormDetailPages
  ];
