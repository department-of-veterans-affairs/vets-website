import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

export const getAppData = state => ({
  eligibility: state.data?.eligibility,
  isClaimantCallComplete: state.data?.personalInfoFetchComplete,
  isEligibilityCallComplete: state.data?.eligibilityFetchComplete,
  showUnverifiedUserAlert: toggleValues(state)[
    FEATURE_FLAG_NAMES.showMebUnverifiedUserAlert
  ],
  user: state.user || {},
});
