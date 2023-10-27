import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import { isLoggedIn } from '~/platform/user/selectors';
import FEATURE_FLAG_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';

/**
 * Determines if the MHV-on-VA.gov Landing Page should be shown.
 *
 * **NOTE**: This selector is dependent upon the following slices of state.
 *   - toggleValues(state)
 *   - selectProfile(state)
 *
 * Check that the loading property of these objects are false before calling
 * this selector function.
 *
 * @param {Object} state Current redux state.
 * @returns {Boolean} Returns true if the landing page is enabled for the
 * current user. Returns false, otherwise.
 */
export const isLandingPageEnabledForUser = state => {
  const loggedIn = isLoggedIn(state);
  const mhvlpFeatureToggle = FEATURE_FLAG_NAMES.mhvLandingPageEnabled;
  const featureToggleEnabled = toggleValues(state)[mhvlpFeatureToggle];
  return loggedIn && featureToggleEnabled;
};
