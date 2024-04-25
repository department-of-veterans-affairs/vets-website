import {
  isAuthenticatedWithSSOe,
  signInServiceEnabled,
  signInServiceName,
} from '~/platform/user/authentication/selectors';
import {
  isInMPI,
  isLOA1,
  isLOA3,
  isLoggedIn,
  isVAPatient,
  selectProfile,
} from '~/platform/user/selectors';
import { selectDrupalStaticData } from '~/platform/site-wide/drupal-static-data/selectors';

import { isLandingPageEnabled, personalizationEnabled } from './featureToggles';
import { isLandingPageEnabledForUser } from './isLandingPageEnabledForUser';
import { selectHasMHVAccountState } from './hasMHVAccountState';
import {
  selectGreetingName,
  selectPersonalInformation,
} from './personalInformation';

const selectVamcEhrData = state =>
  selectDrupalStaticData(state)?.vamcEhrData || {};

export {
  isAuthenticatedWithSSOe,
  isInMPI,
  isLandingPageEnabled,
  isLandingPageEnabledForUser,
  isLOA1,
  isLOA3,
  isLoggedIn,
  isVAPatient,
  personalizationEnabled,
  selectDrupalStaticData,
  selectGreetingName,
  selectPersonalInformation,
  selectProfile,
  selectVamcEhrData,
  signInServiceEnabled,
  signInServiceName,
  selectHasMHVAccountState,
};
