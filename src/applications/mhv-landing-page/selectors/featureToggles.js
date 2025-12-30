import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import FEATURE_FLAG_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';

/**
 * Determines if the Landing Page Personalization changes are enabled.
 * @param {Object} state Current redux state.
 * @returns {Boolean} true if the personalization is enabled
 */
export const personalizationEnabled = state => {
  return toggleValues(state)[FEATURE_FLAG_NAMES.mhvLandingPagePersonalization];
};
