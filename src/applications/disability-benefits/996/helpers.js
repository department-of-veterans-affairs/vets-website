// import the toggleValues helper
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const higherLevelReviewFeature = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.form996HigherLevelReview];

// testing
export const $ = (selector, DOM) => DOM.querySelector(selector);
export const $$ = (selector, DOM) => DOM.querySelectorAll(selector);
