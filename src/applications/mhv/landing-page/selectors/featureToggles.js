import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import FEATURE_FLAG_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';

/**
 * Determines if the MHV-on-VA.gov Landing Page feature toggle is enabled.
 * @param {Object} state Current redux state.
 * @returns {Boolean}
 */
export const isLandingPageEnabled = state => {
  return toggleValues(state)[FEATURE_FLAG_NAMES.mhvLandingPageEnabled];
};

/**
 * Determines if the Landing Page Welcome component is enabled.
 * @param {Object} state Current redux state.
 * @returns {Boolean}
 */
export const welcomeEnabled = state => {
  return toggleValues(state)[FEATURE_FLAG_NAMES.mhvLandingPageWelcome];
};
