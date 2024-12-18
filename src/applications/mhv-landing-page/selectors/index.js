import {
  isAuthenticatedWithSSOe,
  signInServiceEnabled,
  signInServiceName,
} from '~/platform/user/authentication/selectors';
import {
  isLoggedIn,
  selectProfile,
  isLOA1,
  isLOA3,
  isInMPI,
  isProfileLoading,
  isVAPatient,
} from '~/platform/user/selectors';
import { selectDrupalStaticData } from '~/platform/site-wide/drupal-static-data/selectors';

import { personalizationEnabled, mrPhase1Enabled } from './featureToggles';
import { hasMhvAccount } from './hasMhvAccount';
import { selectGreetingName } from './personalInformation';
import { hasMhvBasicAccount } from './hasMhvBasicAccount';

export {
  hasMhvAccount,
  hasMhvBasicAccount,
  isAuthenticatedWithSSOe,
  isInMPI,
  isLOA1,
  isLOA3,
  isLoggedIn,
  isProfileLoading,
  isVAPatient,
  mrPhase1Enabled,
  personalizationEnabled,
  selectDrupalStaticData,
  selectGreetingName,
  selectProfile,
  signInServiceEnabled,
  signInServiceName,
};
