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

import { personalizationEnabled } from './featureToggles';
import { hasMhvAccount } from './hasMhvAccount';
import {
  selectGreetingName,
  selectPersonalInformation,
} from './personalInformation';
import { showVerifyAndRegisterAlert } from './showVerifyAndRegisterAlert';
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
  personalizationEnabled,
  selectDrupalStaticData,
  selectGreetingName,
  selectPersonalInformation,
  selectProfile,
  signInServiceEnabled,
  signInServiceName,
  showVerifyAndRegisterAlert,
};
