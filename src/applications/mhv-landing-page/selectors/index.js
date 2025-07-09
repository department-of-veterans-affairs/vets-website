import {
  isAuthenticatedWithSSOe,
  signInServiceEnabled,
  signInServiceName,
} from '~/platform/user/authentication/selectors';
import {
  selectProfile,
  isLOA3,
  isInMPI,
  isVAPatient,
} from '~/platform/user/selectors';
import { selectDrupalStaticData } from '~/platform/site-wide/drupal-static-data/selectors';

import { personalizationEnabled } from './featureToggles';
import { hasEdipi } from './hasEdipi';
import { hasMhvAccount } from './hasMhvAccount';
import { selectGreetingName } from './personalInformation';
import { showVerifyAndRegisterAlert } from './showVerifyAndRegisterAlert';
import { hasMessagingAccess } from './hasMessagingAccess';

import {
  mhvAccountStatusLoading,
  mhvAccountStatusUserError,
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
import { profileHasEHRM, profileHasVista, isCerner } from './facilities';
import {
  selectVaPatient,
  selectProfileLoa,
  selectProfileLogInProvider,
} from './accountInformation';

export {
  hasEdipi,
  hasMhvAccount,
  hasMessagingAccess,
  isAuthenticatedWithSSOe,
  isCerner,
  isInMPI,
  isLOA3,
  isVAPatient,
  mhvAccountStatusLoading,
  mhvAccountStatusUserError,
  mhvAccountStatusErrorsSorted,
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
