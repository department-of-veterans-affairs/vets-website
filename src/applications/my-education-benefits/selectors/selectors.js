import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import {
  isLOA1 as isLOA1Selector,
  isLOA3 as isLOA3Selector,
} from 'platform/user/selectors';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

export const getAppData = state => ({
  eligibility: state.data?.eligibility,
  duplicateEmail: state.data?.duplicateEmail,
  duplicatePhone: state.data?.duplicatePhone,
  email: state?.form?.data?.email?.email,
  mobilePhone:
    state?.data?.formData?.data?.attributes?.claimant?.contactInfo
      ?.mobilePhoneNumber,
  openModal: state?.data?.openModal,
  featureTogglesLoaded: state.featureToggles?.loading === false,
  formId: state?.form?.formId,
  isClaimantCallComplete: state.data?.personalInfoFetchComplete,
  isEligibilityCallComplete: state.data?.eligibilityFetchComplete,
  isLOA1: isLOA1Selector(state),
  isLOA3: isLOA3Selector(state),
  isLoggedIn: state?.user?.login?.currentlyLoggedIn,
  savedForms: state?.user?.profile?.savedForms,
  showDgiDirectDeposit1990EZ: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.showDgiDirectDeposit1990EZ
  ],
  showMeb1990EZMaintenanceAlert: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.showMeb1990EZMaintenanceAlert
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
  showMebEnhancements09: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.showMebEnhancements09
  ],
  showMebServiceHistoryCategorizeDisagreement: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.showMebServiceHistoryCategorizeDisagreement
  ],
  mebExclusionPeriodEnabled: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.mebExclusionPeriodEnabled
  ],
  user: state.user || {},
});
