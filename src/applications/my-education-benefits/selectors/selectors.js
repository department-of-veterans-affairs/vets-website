import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import {
  isLOA1 as isLOA1Selector,
  isLOA3 as isLOA3Selector,
} from 'platform/user/selectors';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';

/**
 * Custom Selectors for Eligibility Flags
 */

// Eligible for Active Duty Kicker
export const selectEligibleForActiveDutyKicker = state => {
  return state?.data?.formData?.data?.attributes?.claimant
    ?.eligibleForActiveDutyKicker;
};

// Eligible for Reserve Kicker
export const selectEligibleForReserveKicker = state => {
  return state?.data?.formData?.data?.attributes?.claimant
    ?.eligibleForReserveKicker;
};

export const getAppData = state => ({
  benefitEffectiveDate: state?.form?.data?.benefitEffectiveDate,
  duplicateEmail: state.data?.duplicateEmail,
  duplicatePhone: state.data?.duplicatePhone,
  eligibleForActiveDutyKicker: selectEligibleForActiveDutyKicker(state),
  eligibleForReserveKicker: selectEligibleForReserveKicker(state),
  email: state?.form?.data?.email?.email,
  mobilePhone:
    state?.data?.formData?.data?.attributes?.claimant?.contactInfo
      ?.mobilePhoneNumber,
  openModal: state?.data?.openModal,
  featureTogglesLoaded: state.featureToggles?.loading === false,
  formId: state?.form?.formId,
  isClaimantCallComplete: state.data?.personalInfoFetchComplete,
  isLOA1: isLOA1Selector(state),
  isLOA3: isLOA3Selector(state),
  isLoggedIn: state?.user?.login?.currentlyLoggedIn,
  savedForms: state?.user?.profile?.savedForms,
  user: state.user || {},
  showMeb1990EZMaintenanceAlert: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.showMeb1990EZMaintenanceAlert
  ],
  showMeb1990EZR6MaintenanceMessage: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.showMeb1990EZR6MaintenanceMessage
  ],
  showMebEnhancements06: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.showMebEnhancements06
  ],
  showMebEnhancements08: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.showMebEnhancements08
  ],
  showMebEnhancements09: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.showMebEnhancements09
  ],
  mebKickerNotificationEnabled: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.mebKickerNotificationEnabled
  ],
  mebAutoPopulateRelinquishmentDate: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.mebAutoPopulateRelinquishmentDate
  ],
  dgiRudisillHideBenefitsSelectionStep: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.dgiRudisillHideBenefitsSelectionStep
  ],
  meb160630Automation: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.meb160630Automation
  ],
  mebDpoAddressOptionEnabled: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.mebDpoAddressOptionEnabled
  ],
  meb1995Reroute: !!toggleValues(state)[FEATURE_FLAG_NAMES.meb1995Reroute],
  // **NEW** flag for the v2 intro/process updates
  showMeb54901990eTextUpdate: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.showMeb54901990eTextUpdate
  ],
  mebBankInfoConfirmationField: !!toggleValues(state)[
    FEATURE_FLAG_NAMES.mebBankInfoConfirmationField
  ],
});
