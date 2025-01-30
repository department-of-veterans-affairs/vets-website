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

import {
  apiAccountStatusEnabled,
  personalizationEnabled,
} from './featureToggles';
import { hasMhvAccount } from './hasMhvAccount';
import { selectGreetingName } from './personalInformation';
import { showVerifyAndRegisterAlert } from './showVerifyAndRegisterAlert';
import { hasMhvBasicAccount } from './hasMhvBasicAccount';

import {
  mhvAccountStatusLoading,
  mhvAccountStatusUsersuccess,
  mhvAccountStatusUserError,
  mhvAccountStatusNonUserError,
  mhvAccountStatusErrorsSorted,
} from './mhvAccountStatus';

export {
  apiAccountStatusEnabled,
  hasMhvAccount,
  hasMhvBasicAccount,
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
  selectDrupalStaticData,
  selectGreetingName,
  selectProfile,
  signInServiceEnabled,
  signInServiceName,
  showVerifyAndRegisterAlert,
};
