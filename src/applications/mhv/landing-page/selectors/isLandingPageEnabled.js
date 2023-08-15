import { CSP_IDS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import { selectIsCernerPatient } from '~/platform/user/cerner-dsot/selectors';
import { selectPatientFacilities, selectProfile } from '~/platform/user/selectors';
import { signInServiceName } from '~/platform/user/authentication/selectors';
import FEATURE_FLAG_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';

const ENABLED_LOGIN_PROVIDERS = Object.freeze([
  CSP_IDS.ID_ME,
  CSP_IDS.LOGIN_GOV,
]);

// const isLandingPageEnabledForUser = (state = {}) => {
//   const { featureToggles, user } = state;
//   if (!featureToggles[FEATURE_FLAG_NAMES.mvhLandingPageEnabled]) {
//     return false;
//   }
//   const { currentlyLoggedIn } = user?.login;
//   if (!currentlyLoggedIn) {
//     return false;
//   }
//   const { serviceName } = user?.profile?.signIn;
//   const isCernerPatient = selectIsCernerPatient(state);
//   const hasFacilities = user.profile.facilities?.length > 0;
//   return (
//     ENABLED_LOGIN_PROVIDERS.includes(serviceName) &&
//     !isCernerPatient &&
//     hasFacilities
//   );
// };
// export { isLandingPageEnabledForUser };

export const isLandingPageEnabled = state => {
  const featureToggleEnabled =
    toggleValues(state)[FEATURE_FLAG_NAMES.mhvLandingPageEnabled];
  // const serviceName = signInServiceName(state);
  const serviceName = selectProfile(state).signIn?.serviceName;
  const hasValidLoginProvider = ENABLED_LOGIN_PROVIDERS.includes(serviceName);
  const hasFacilities = selectPatientFacilities(state);
  const isCernerPatient = selectIsCernerPatient(state);
  console.log({ featureToggleEnabled, serviceName, hasValidLoginProvider, hasFacilities, isCernerPatient });
  return (
    featureToggleEnabled &&
    hasValidLoginProvider &&
    hasFacilities &&
    !isCernerPatient
  );
}