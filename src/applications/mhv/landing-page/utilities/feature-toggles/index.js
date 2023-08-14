import { CSP_IDS } from '~/platform/user/authentication/constants';
import FEATURE_FLAG_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';
// import { selectIsCernerPatient } from '~/platform/user/cerner-dsot/selectors';

const ENABLED_LOGIN_PROVIDERS = Object.freeze([
  CSP_IDS.ID_ME,
  CSP_IDS.LOGIN_GOV,
]);

const isLandingPageEnabledForUser = (state = {}) => {
  const { featureToggles, user } = state;
  if (!featureToggles[FEATURE_FLAG_NAMES.mhvLandingPageEnabled]) {
    console.log("mhvLandingPageEnabled false");
    return false;
  }
  // const { currentlyLoggedIn } = user.login;
  // if (!currentlyLoggedIn) {
  //   console.log("not currentlyLoggedIn");
  //   return false;
  // }
  const serviceName = user?.profile?.signIn?.serviceName || '';
  const hasValidLoginProvider = ENABLED_LOGIN_PROVIDERS.includes(serviceName);
  if (!hasValidLoginProvider) {
    console.log("hasValidLoginProvider false");
    console.log({ serviceName });
    return false;
  }
  // const isCernerPatient = selectIsCernerPatient(state);
  const facilities = user?.profile?.facilities || [];
  const hasFacilities = facilities.length > 0;
  if (!hasFacilities) {
    console.log("hasFacilities false");
    return false;
  }
  const isCernerPatient = hasFacilities && facilities.some(f => f.isCerner);
  if (isCernerPatient) {
    console.log("isCernerPatient true");
    return false;
  }
  return hasValidLoginProvider && hasFacilities && !isCernerPatient;
};
export { isLandingPageEnabledForUser };
