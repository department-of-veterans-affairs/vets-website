import {
  isAuthenticatedWithSSOe,
  signInServiceEnabled,
} from '~/platform/user/authentication/selectors';
import {
  isLoggedIn,
  selectProfile,
  isLOA3,
  isInMPI,
} from '~/platform/user/selectors';
import { selectDrupalStaticData } from '~/platform/site-wide/drupal-static-data/selectors';

import { isLandingPageEnabled, personalizationEnabled } from './featureToggles';
import { isLandingPageEnabledForUser } from './isLandingPageEnabledForUser';
import { hasHealthData } from './hasHealthData';
import { hasMhvAccount } from './hasMhvAccount';
import {
  selectGreetingName,
  selectPersonalInformation,
} from './personalInformation';

const selectVamcEhrData = state =>
  selectDrupalStaticData(state)?.vamcEhrData || {};

export {
  hasHealthData,
  isAuthenticatedWithSSOe,
  isInMPI,
  isLandingPageEnabled,
  isLandingPageEnabledForUser,
  isLOA3,
  isLoggedIn,
  personalizationEnabled,
  selectDrupalStaticData,
  selectGreetingName,
  selectPersonalInformation,
  selectProfile,
  selectVamcEhrData,
  signInServiceEnabled,
  hasMhvAccount,
};
