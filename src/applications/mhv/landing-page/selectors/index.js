import { selectProfile } from '~/platform/user/selectors';
// import { selectVamcEhrData } from '~/platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import { isAppEnabled } from './isAppEnabled';

const selectVamcEhrData = state => state?.drupalStaticData?.vamcEhrData;

export {
  selectProfile,
  selectVamcEhrData,
  isAppEnabled,
  isAuthenticatedWithSSOe,
};
