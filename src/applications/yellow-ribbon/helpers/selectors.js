// import the toggleValues helper
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const getYellowRibbonAppState = state => state.yellowRibbonReducer;

export const selectShowYellowRibbonEnhancements = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.yellowRibbonEnhancements];
