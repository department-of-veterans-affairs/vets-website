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

export const cnpDirectDepositAddressInformation = state =>
  cnpDirectDepositInformation(state)?.paymentAddress;

export const cnpDirectDepositIsEligible = state =>
  !!cnpDirectDepositInformation(state)?.controlInformation
    ?.canUpdateDirectDeposit;

export const cnpDirectDepositIsBlocked = state => {
  const controlInfo = cnpDirectDepositInformation(state)?.controlInformation;

  if (!controlInfo) return false;

  // 2 sets of flags are used to determine if the user is blocked from
  // setting up direct deposit. Remove the first set once the
  // lighthouse based feature flag is removed.
  const controlInfoFlags = [
    'isCompetentIndicator',
    'noFiduciaryAssignedIndicator',
    'notDeceasedIndicator',

    'isCompetent',
    'hasNoFiduciaryAssigned',
    'isNotDeceased',
  ];

  // if any flag is false, the user is blocked
  // but first we have to determine if that particular flag property exists
  return controlInfoFlags.some(
    flag => has(controlInfo, flag) && !controlInfo[flag],
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

export const selectHideDirectDepositCompAndPen = state =>
  toggleValues(state)?.[FEATURE_FLAG_NAMES.profileHideDirectDepositCompAndPen];

export const selectIsBlocked = state => cnpDirectDepositIsBlocked(state);

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
