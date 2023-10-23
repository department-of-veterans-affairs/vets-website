import {
  isAuthenticatedWithSSOe,
  signInServiceEnabled,
} from '~/platform/user/authentication/selectors';
import { isLoggedIn, selectProfile } from '~/platform/user/selectors';
import { selectJsonStaticData } from '~/platform/site-wide/json-static-data/selectors';

import { isLandingPageEnabled } from './isLandingPageEnabled';
import { isLandingPageEnabledForUser } from './isLandingPageEnabledForUser';

const selectVamcEhrData = state =>
  selectJsonStaticData(state)?.vamcEhrData || {};

export {
  isAuthenticatedWithSSOe,
  isLandingPageEnabled,
  isLandingPageEnabledForUser,
  isLoggedIn,
  selectJsonStaticData,
  selectProfile,
  selectVamcEhrData,
  signInServiceEnabled,
};
