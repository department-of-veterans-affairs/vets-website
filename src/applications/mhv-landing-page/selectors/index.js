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
import { hasEdipi } from './hasEdipi';
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
import {
  militaryServiceLoading,
  militaryServiceSuccessfulDownload,
  militaryServiceFailedDownload,
  militaryServiceError,
} from './militaryServicePdf';
import {
  seiLoading,
  seiFailedDomains,
  seiSuccessfulDownload,
  seiFailedDownload,
} from './seiPdf';
import { profileHasEHRM, profileHasVista } from './facilities';
import {
  selectVaPatient,
  selectProfileLoa,
  selectProfileLogInProvider,
} from './accountInformation';

export {
  hasEdipi,
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
  militaryServiceLoading,
  militaryServiceSuccessfulDownload,
  militaryServiceFailedDownload,
  militaryServiceError,
  personalizationEnabled,
  profileHasEHRM,
  profileHasVista,
  seiLoading,
  seiFailedDomains,
  seiSuccessfulDownload,
  seiFailedDownload,
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
