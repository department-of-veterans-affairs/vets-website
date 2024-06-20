import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import {
  isLOA1 as isLOA1Selector,
  isLOA3 as isLOA3Selector,
} from 'platform/user/selectors';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

export const getLettersData = state => ({
  featureTogglesLoaded: state.featureToggles?.loading === false,
  isLoggedIn: state?.user?.login?.currentlyLoggedIn || false,
  isLOA1: isLOA1Selector(state),
  isLOA3: isLOA3Selector(state),
  hasCheckedKeepAlive: state?.user?.login?.hasCheckedKeepAlive || false,
  showMebEnhancements09: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.showMebEnhancements09
  ],
  showMebLettersMaintenanceAlert: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.showMebLettersMaintenanceAlert
  ],
});
