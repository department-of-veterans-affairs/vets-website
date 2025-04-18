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
import { selectGreetingName } from './personalInformation';
import { showVerifyAndRegisterAlert } from './showVerifyAndRegisterAlert';
import { hasMhvBasicAccount } from './hasMhvBasicAccount';
import { hasMessagingAccess } from './hasMessagingAccess';

import {
  mhvAccountStatusLoading,
  mhvAccountStatusUsersuccess,
  mhvAccountStatusUserError,
  mhvAccountStatusNonUserError,
  mhvAccountStatusErrorsSorted,
} from './mhvAccountStatus';

import { profileHasEHRM, profileHasVista } from './facilities';
import {
  selectVaPatient,
  selectProfileLoa,
  selectProfileLogInProvider,
} from './accountInformation';

export {
  hasMhvAccount,
  hasMhvBasicAccount,
  hasMessagingAccess,
  isAuthenticatedWithSSOe,
  isInMPI,
  isLOA1,
  isLOA3,
  isLoggedIn,
  isProfileLoading,
  isVAPatient,
  mhvAccountStatusLoading,
  mhvAccountStatusUsersuccess,
  mhvAccountStatusUserError,
  mhvAccountStatusErrorsSorted,
  mhvAccountStatusNonUserError,
  personalizationEnabled,
  profileHasEHRM,
  profileHasVista,
  selectDrupalStaticData,
  selectGreetingName,
  selectVaPatient,
  selectProfile,
  selectProfileLoa,
  selectProfileLogInProvider,
  signInServiceEnabled,
  signInServiceName,
  showVerifyAndRegisterAlert,
};
