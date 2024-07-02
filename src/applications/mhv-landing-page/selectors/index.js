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

import {
  isLandingPageEnabled,
  personalizationEnabled,
  helpdeskInfoEnabled,
} from './featureToggles';
import { isLandingPageEnabledForUser } from './isLandingPageEnabledForUser';
import { hasMhvAccount } from './hasMhvAccount';
import {
  selectGreetingName,
  selectPersonalInformation,
} from './personalInformation';

export {
  isAuthenticatedWithSSOe,
  isInMPI,
  isLandingPageEnabled,
  isLandingPageEnabledForUser,
  isLOA1,
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
