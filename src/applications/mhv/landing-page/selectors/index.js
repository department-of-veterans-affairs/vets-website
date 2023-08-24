import {
  isAuthenticatedWithSSOe,
  signInServiceEnabled,
} from '~/platform/user/authentication/selectors';
import { isLoggedIn, selectProfile } from '~/platform/user/selectors';
import { selectDrupalStaticData } from '~/platform/site-wide/drupal-static-data/selectors';

import { isLandingPageEnabled, showPriorityGroup } from './features';
import { isLandingPageEnabledForUser } from './isLandingPageEnabledForUser';

const selectPriorityGroup = state =>
  state?.mhvLandingPage?.hcaEnrollmentStatus?.data?.priorityGroup || null;

const selectVamcEhrData = state =>
  selectDrupalStaticData(state)?.vamcEhrData || {};

export {
  isAuthenticatedWithSSOe,
  isLandingPageEnabled,
  isLandingPageEnabledForUser,
  isLoggedIn,
  selectDrupalStaticData,
  selectPriorityGroup,
  selectProfile,
  selectVamcEhrData,
  showPriorityGroup,
  signInServiceEnabled,
};
