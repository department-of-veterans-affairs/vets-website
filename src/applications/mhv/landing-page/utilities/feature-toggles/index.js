import { CSP_IDS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
// import { selectIsCernerPatient } from '@department-of-veterans-affairs/platform-user';

const ENABLED_LOGIN_PROVIDERS = Object.freeze([
  CSP_IDS.ID_ME,
  CSP_IDS.LOGIN_GOV,
]);

const isLandingPageEnabledForUser = (state = {}) => {
  const { featureToggles, user } = state;
  if (!featureToggles[FEATURE_FLAG_NAMES.mhvLandingPageEnabled]) {
    return false;
  }
  const { currentlyLoggedIn } = user?.login;
  if (!currentlyLoggedIn) {
    return false;
  }
  const { serviceName } = user?.profile?.signIn;
  // const isCernerPatient = selectIsCernerPatient(state); // dependent on state.drupalStaticData.vamcEhrData
  const hasFacilities = user.profile.facilities?.length > 0;
  const isCernerPatient =
    hasFacilities && user?.profile?.facilities.some(f => f.isCerner);
  // console.log({ currentlyLoggedIn, serviceName, isCernerPatient, hasFacilities });
  return (
    ENABLED_LOGIN_PROVIDERS.includes(serviceName) &&
    !isCernerPatient &&
    hasFacilities
  );
};
export { isLandingPageEnabledForUser };
