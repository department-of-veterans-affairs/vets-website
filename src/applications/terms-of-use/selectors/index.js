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

import {
  profileHasEHRM,
  profileHasVista,
  selectProfileLoa,
  selectProfileLogInProvider,
  selectVaPatient,
} from './facilities';

export {
  isAuthenticatedWithSSOe,
  isInMPI,
  isLOA1,
  isLOA3,
  isLoggedIn,
  isProfileLoading,
  isVAPatient,
  profileHasEHRM,
  profileHasVista,
  selectProfile,
  selectProfileLoa,
  selectProfileLogInProvider,
  selectVaPatient,
  signInServiceEnabled,
  signInServiceName,
};
