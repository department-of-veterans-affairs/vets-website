import {
  isAuthenticatedWithSSOe,
  signInServiceEnabled,
} from '~/platform/user/authentication/selectors';
import { isLoggedIn, selectProfile } from '~/platform/user/selectors';
import { selectDrupalStaticData } from '~/platform/site-wide/drupal-static-data/selectors';

import { isLandingPageEnabled, welcomeEnabled } from './featureToggles';
import { isLandingPageEnabledForUser } from './isLandingPageEnabledForUser';
import { hasHealthData } from './hasHealthData';

const selectVamcEhrData = state =>
  selectDrupalStaticData(state)?.vamcEhrData || {};

const selectGreetingName = state =>
  state?.profile?.userFullName?.first || state?.profile?.email;

export {
  hasHealthData,
  isAuthenticatedWithSSOe,
  isLandingPageEnabled,
  isLandingPageEnabledForUser,
  isLoggedIn,
  selectDrupalStaticData,
  selectGreetingName,
  selectProfile,
  selectVamcEhrData,
  signInServiceEnabled,
  welcomeEnabled,
};
