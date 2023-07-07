import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import {
  isLOA1 as isLOA1Selector,
  isLOA3 as isLOA3Selector,
} from 'platform/user/selectors';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

export const getAppData = state => ({
  eligibility: state.data?.eligibility,
  featureTogglesLoaded: state.featureToggles?.loading === false,
  formId: state?.form?.formId,
  isClaimantCallComplete: state.data?.personalInfoFetchComplete,
  isEligibilityCallComplete: state.data?.eligibilityFetchComplete,
  isLOA1: isLOA1Selector(state),
  isLOA3: isLOA3Selector(state),
  isLoggedIn: state?.user?.login?.currentlyLoggedIn,
  savedForms: state?.user?.profile?.savedForms,
  showMebDgi40Features: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.showMebDgi40Features
  ],
  showMebCh33SelfForm: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.showMebCh33SelfForm
  ],
  showMebDgi42Features: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.showMebDgi42Features
  ],
  // Add the new feature flag: showMebEnhancements
  showMebEnhancements: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.showMebEnhancements
  ],
  // Add the new feature flag: showMebEnhancements
  showMebEnhancements06: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.showMebEnhancements06
  ],
  showMebEnhancements08: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.showMebEnhancements08
  ],
  user: state.user || {},
});
