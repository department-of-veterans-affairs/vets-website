import {
  isAuthenticatedWithSSOe,
  signInServiceEnabled,
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
import { hasHealthData } from './hasHealthData';
import { selectHasMHVAccountState } from './hasMHVAccountState';
import {
  selectGreetingName,
  selectPersonalInformation,
} from './personalInformation';

export {
  isAuthenticatedWithSSOe,
  isInMPI,
  isLOA3,
  isLoggedIn,
  isProfileLoading,
  isVAPatient,
  personalizationEnabled,
  helpdeskInfoEnabled,
  selectDrupalStaticData,
  selectGreetingName,
  selectPersonalInformation,
  selectProfile,
  signInServiceEnabled,
  hasMhvAccount,
};
