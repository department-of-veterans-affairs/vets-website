import { CSP_IDS } from '@department-of-veterans-affairs/platform-user/authentication/constants';
import { toggleValues } from '@department-of-veterans-affairs/platform-site-wide/selectors';
import { selectIsCernerPatient } from '~/platform/user/cerner-dsot/selectors';
import { selectPatientFacilities } from '~/platform/user/selectors';
import { signInServiceName } from '~/platform/user/authentication/selectors';
import FEATURE_FLAG_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';

const ENABLED_LOGIN_PROVIDERS = Object.freeze([
  CSP_IDS.ID_ME,
  CSP_IDS.LOGIN_GOV,
]);

export const isLandingPageEnabled = state => {
  const mhvlpFeatureToggle = FEATURE_FLAG_NAMES.mhvLandingPageEnabled;
  const featureToggleEnabled = toggleValues(state)[mhvlpFeatureToggle];
  const serviceName = signInServiceName(state);
  const hasValidLoginProvider = ENABLED_LOGIN_PROVIDERS.includes(serviceName);
  const facilities = selectPatientFacilities(state) || [];
  const hasFacilities = facilities && facilities.length > 0;
  const isCernerPatient = selectIsCernerPatient(state);
  // console.log({ featureToggleEnabled, serviceName, hasValidLoginProvider, hasFacilities, isCernerPatient });
  return (
    featureToggleEnabled &&
    hasValidLoginProvider &&
    hasFacilities &&
    !isCernerPatient
  );
};
