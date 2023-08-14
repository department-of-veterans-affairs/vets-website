import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import { isLoggedIn, selectProfile } from '~/platform/user/selectors';
import { selectDrupalStaticData } from '~/platform/site-wide/drupal-static-data/selectors';

export {
  isAuthenticatedWithSSOe,
  isLoggedIn,
  selectDrupalStaticData,
  selectProfile,
};
