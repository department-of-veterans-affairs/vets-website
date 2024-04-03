import has from 'lodash/has';
import { createSelector } from 'reselect';

import { toggleValues } from '~/platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';
import { CSP_IDS } from '~/platform/user/authentication/constants';

import {
  cnpDirectDepositBankInfo,
  isSignedUpForCNPDirectDeposit,
  isSignedUpForEDUDirectDeposit,
} from './util';

import { PROFILE_TOGGLES } from './constants';

// START OF TODO: remove this once the direct deposit form is updated to use single form
export const cnpDirectDepositInformation = state =>
  state.vaProfile?.cnpPaymentInformation;

export const eduDirectDepositInformation = state =>
  state.vaProfile?.eduPaymentInformation;

export const cnpDirectDepositUiState = state =>
  state.vaProfile?.cnpPaymentInformationUiState;

export const eduDirectDepositUiState = state =>
  state.vaProfile?.eduPaymentInformationUiState;

export const cnpDirectDepositAccountInformation = state =>
  cnpDirectDepositBankInfo(cnpDirectDepositInformation(state));

export const eduDirectDepositAccountInformation = state =>
  eduDirectDepositInformation(state)?.paymentAccount;

export const cnpDirectDepositIsSetUp = state =>
  isSignedUpForCNPDirectDeposit(cnpDirectDepositInformation(state));

export const eduDirectDepositIsSetUp = state =>
  isSignedUpForEDUDirectDeposit(eduDirectDepositAccountInformation(state));

export const cnpDirectDepositLoadError = state =>
  cnpDirectDepositInformation(state)?.error;

// If the error is a 403 error, we will treat it like a no-data state, not an
// error.
export const eduDirectDepositLoadError = state => {
  const error = eduDirectDepositInformation(state)?.error;
  if (error?.errors instanceof Array) {
    error.errors = error.errors.filter(err => {
      return err.code !== '403';
    });
    if (!error.errors.length) {
      return undefined;
    }
  }
  return error;
};

export const cnpDirectDepositIsEligible = state =>
  !!cnpDirectDepositInformation(state)?.controlInformation
    ?.canUpdateDirectDeposit;
// END OF TODO: remove this once the direct deposit form is updated to use single form

// if there is no account information but and error, we can assume the user has
// encountered an error while trying to load their direct deposit information
export const selectHasDirectDepositLoadError = state =>
  state.directDeposit?.loadError;

// if there is an error and account information, we can assume the user has
// encountered an error while trying to save new direct deposit information
export const selectHasDirectDepositSaveError = state =>
  state.directDeposit?.saveError;

// used specifically for direct deposit control information
export const getIsBlocked = controlInformation => {
  if (!controlInformation) return false;

  const propertiesToCheck = [
    'isCompetent',
    'hasNoFiduciaryAssigned',
    'isNotDeceased',
  ];

  // if any flag is false, the user is blocked
  // but first we have to determine if that particular flag property exists
  return propertiesToCheck.some(
    flag => has(controlInformation, flag) && !controlInformation[flag],
  );
};

export const personalInformationLoadError = state => {
  return (
    state.vaProfile?.personalInformation?.errors ||
    state.vaProfile?.personalInformation?.error
  );
};

export const militaryInformationLoadError = state => {
  return state.vaProfile?.militaryInformation?.serviceHistory?.error;
};

export const profileShowPronounsAndSexualOrientation = state =>
  toggleValues(state)?.[
    FEATURE_FLAG_NAMES.profileShowPronounsAndSexualOrientation
  ];

export const profileDoNotRequireInternationalZipCode = state =>
  toggleValues(state)?.[
    FEATURE_FLAG_NAMES.profileDoNotRequireInternationalZipCode
  ];

export const togglesAreLoaded = state => {
  return !toggleValues(state)?.loading;
};

export const selectProfileToggles = createSelector(toggleValues, values => {
  const { loading } = values;

  return Object.keys(PROFILE_TOGGLES).reduce(
    (acc, toggle) => {
      const key = FEATURE_FLAG_NAMES[toggle];
      acc[toggle] = values[key];
      return acc;
    },
    { loading, ...PROFILE_TOGGLES },
  );
});

// TODO: update this to use a more universal toggle for single form direct deposit
export const selectHideDirectDepositCompAndPen = state =>
  toggleValues(state)?.[FEATURE_FLAG_NAMES.profileHideDirectDepositCompAndPen];

export const selectIsBlocked = state => {
  // TODO: remove this once the direct deposit form is updated to use single form
  const showDirectDepositSingleForm = toggleValues(state)?.[
    FEATURE_FLAG_NAMES.profileShowDirectDepositSingleForm
  ];

  return showDirectDepositSingleForm
    ? getIsBlocked(state.directDeposit.controlInformation)
    : getIsBlocked(cnpDirectDepositInformation(state)?.controlInformation);
};

export const selectProfileContactsToggle = state =>
  toggleValues(state)?.[FEATURE_FLAG_NAMES.profileContacts] || false;

export const selectProfileShowProofOfVeteranStatusToggle = state =>
  toggleValues(state)?.[FEATURE_FLAG_NAMES.profileShowProofOfVeteranStatus];

export const selectProfileContacts = state => state?.profileContacts || {};

export const selectHasRetiringSignInService = state => {
  const serviceName = state?.user?.profile?.signIn?.serviceName;
  return !serviceName || [CSP_IDS.DS_LOGON, CSP_IDS.MHV].includes(serviceName);
};

export const selectShowCredRetirementMessaging = state => {
  return (
    toggleValues(state)?.[
      FEATURE_FLAG_NAMES.profileShowCredentialRetirementMessaging
    ] && selectHasRetiringSignInService(state)
  );
};
