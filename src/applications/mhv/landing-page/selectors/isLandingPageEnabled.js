import { CSP_IDS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import { selectIsCernerPatient } from '~/platform/user/cerner-dsot/selectors';
import { isLoggedIn, selectPatientFacilities } from '~/platform/user/selectors';
import { signInServiceName } from '~/platform/user/authentication/selectors';
import FEATURE_FLAG_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';

const ENABLED_LOGIN_PROVIDERS = Object.freeze([
  CSP_IDS.ID_ME,
  CSP_IDS.LOGIN_GOV,
]);

/**
 * Determines if the MHV-on-VA.gov Landing Page should be shown.
 * **NOTE**: This selector is dependent upon the following slices of state.
 *   - toggleValues(state)
 *   - selectProfile(state)
 *   - selectDrupalStaticData(state).vamcEhrData
 * Check that the loading property of these objects are false before calling
 * this selector function.
 * @param {Object} state Current redux state.
 * @returns {Boolean} Returns true if the landing page is enabled. Returns
 *   false, otherwise.
 */
export const isLandingPageEnabled = state => {
  const loggedIn = isLoggedIn(state);
  if (!loggedIn) return false;
  const mhvlpFeatureToggle = FEATURE_FLAG_NAMES.mhvLandingPageEnabled;
  const featureToggleEnabled = toggleValues(state)[mhvlpFeatureToggle];
  if (!featureToggleEnabled) return false;
  const serviceName = signInServiceName(state);
  const hasValidLoginProvider = ENABLED_LOGIN_PROVIDERS.includes(serviceName);
  // selectPatientFacilites alters the facilities array using map. You _must_
  // use this selector. DO NOT traverse state. e.g. - state.user.profile.facilities
  const facilities = selectPatientFacilities(state) || [];
  const hasFacilities = facilities.length > 0;
  const isCernerPatient = selectIsCernerPatient(state);
  // console.log({ loggedIn, featureToggleEnabled, serviceName, hasValidLoginProvider, hasFacilities, isCernerPatient });
  return (
    loggedIn &&
    featureToggleEnabled &&
    hasValidLoginProvider &&
    hasFacilities &&
    !isCernerPatient
  );
};
