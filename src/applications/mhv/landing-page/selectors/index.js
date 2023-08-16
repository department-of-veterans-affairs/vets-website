import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import { isLoggedIn, selectProfile } from '~/platform/user/selectors';
import { selectDrupalStaticData } from '~/platform/site-wide/drupal-static-data/selectors';

import { isLandingPageEnabled } from './isLandingPageEnabled';
import { isLandingPageEnabledForUser } from './isLandingPageEnabledForUser';

export {
  isAuthenticatedWithSSOe,
  isLandingPageEnabled,
  isLandingPageEnabledForUser,
  isLoggedIn,
  selectDrupalStaticData,
  selectProfile,
};
