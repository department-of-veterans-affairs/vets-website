import { CSP_IDS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { selectIsCernerPatient } from '~/platform/user/cerner-dsot/selectors';

const ENABLED_LOGIN_PROVIDERS = Object.freeze([
  CSP_IDS.ID_ME,
  CSP_IDS.LOGIN_GOV,
]);

// const isLandingPageEnabledForUser = (featureToggles, serviceName) => {
//   return (
//     featureToggles[FEATURE_FLAG_NAMES.mvhLandingPageEnabled] &&
//     ENABLED_LOGIN_PROVIDERS.includes(serviceName)
//   );
// };

const isLandingPageEnabledForUser = (state = {}) => {
  const { featureToggles, user } = state;
  const { serviceName } = user?.profile?.signIn;
  const { currentlyLoggedIn } = user?.login;
  const isCernerPatient = selectIsCernerPatient(state);
  return (
    featureToggles[FEATURE_FLAG_NAMES.mvhLandingPageEnabled] &&
    currentlyLoggedIn &&
    ENABLED_LOGIN_PROVIDERS.includes(serviceName) &&
    !isCernerPatient
  );
};
export { isLandingPageEnabledForUser };
