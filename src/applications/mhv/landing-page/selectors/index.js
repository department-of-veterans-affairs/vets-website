import {
  isAuthenticatedWithSSOe,
  signInServiceEnabled,
} from '~/platform/user/authentication/selectors';
import { isLoggedIn, selectProfile } from '~/platform/user/selectors';
import { selectDrupalStaticData } from '~/platform/site-wide/drupal-static-data/selectors';

import { isLandingPageEnabled } from './isLandingPageEnabled';
import { isLandingPageEnabledForUser } from './isLandingPageEnabledForUser';

const selectHcaEnrollmentStatus = state =>
  state?.mhvLandingPage?.hcaEnrollmentStatus?.data?.priorityGroup || null;

const selectVamcEhrData = state =>
  selectDrupalStaticData(state)?.vamcEhrData || {};

export {
  isAuthenticatedWithSSOe,
  isLandingPageEnabled,
  isLandingPageEnabledForUser,
  isLoggedIn,
  selectDrupalStaticData,
  selectHcaEnrollmentStatus,
  selectProfile,
  selectVamcEhrData,
  signInServiceEnabled,
};
