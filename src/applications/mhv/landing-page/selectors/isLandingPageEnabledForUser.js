import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import { selectPatientFacilities } from '~/platform/user/cerner-dsot/selectors';
import { isLoggedIn } from '~/platform/user/selectors';
import FEATURE_FLAG_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';

/**
 * Determines if the MHV-on-VA.gov Landing Page should be shown.
 *
 * **NOTE**: This selector is dependent upon the following slices of state.
 *   - toggleValues(state)
 *   - selectProfile(state)
 *   - selectDrupalStaticData(state).vamcEhrData
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
  if (!loggedIn) return false;
  const mhvlpFeatureToggle = FEATURE_FLAG_NAMES.mhvLandingPageEnabled;
  const featureToggleEnabled = toggleValues(state)[mhvlpFeatureToggle];
  if (!featureToggleEnabled) return false;
  // selectPatientFacilites alters the facilities array using map. You _must_
  // use this selector. DO NOT traverse state. e.g. - state.user.profile.facilities
  const facilities = selectPatientFacilities(state) || [];
  const hasFacilities = facilities.length > 0;
  return loggedIn && featureToggleEnabled && hasFacilities;
};
