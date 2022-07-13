import set from 'lodash/set';
import { toggleValues } from '~/platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';
import {
  cnpDirectDepositBankInfo,
  isEligibleForCNPDirectDeposit,
  isSignedUpForCNPDirectDeposit,
  isSignedUpForEDUDirectDeposit,
} from './util';
import { createNotListedTextKey } from './util/personal-information/personalInformationUtils';

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
  cnpDirectDepositInformation(state)?.responses?.[0]?.paymentAddress;

export const cnpDirectDepositAddressIsSetUp = state => {
  return isEligibleForCNPDirectDeposit(cnpDirectDepositInformation(state));
};

export const cnpDirectDepositIsBlocked = state => {
  const controlInfo = cnpDirectDepositInformation(state)?.responses?.[0]
    ?.controlInformation;
  if (!controlInfo) return false;
  return (
    !controlInfo.isCompetentIndicator ||
    !controlInfo.noFiduciaryAssignedIndicator ||
    !controlInfo.notDeceasedIndicator
  );
};

export const fullNameLoadError = state => {
  return state.vaProfile?.hero?.errors;
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

export const showProfileLGBTQEnhancements = state =>
  toggleValues(state)?.[FEATURE_FLAG_NAMES.profileEnhancements] || false;

export const showBadAddressIndicator = state =>
  toggleValues(state)?.[FEATURE_FLAG_NAMES.profileShowBadAddressIndicator] ||
  false;

export const forceBadAddressIndicator = state =>
  toggleValues(state)?.[FEATURE_FLAG_NAMES.profileForceBadAddressIndicator] ||
  false;

export const hasBadAddress = state =>
  state.user?.profile?.vapContactInfo?.mailingAddress?.badAddress;

export const profileShowAddressChangeModal = state =>
  toggleValues(state)?.[FEATURE_FLAG_NAMES.profileShowAddressChangeModal] ||
  false;

export const profileShowPronounsAndSexualOrientation = state =>
  toggleValues(state)?.[
    FEATURE_FLAG_NAMES.profileShowPronounsAndSexualOrientation
  ];

export const profileDoNotRequireInternationalZipCode = state =>
  toggleValues(state)?.[
    FEATURE_FLAG_NAMES.profileDoNotRequireInternationalZipCode
  ];

export function selectVAProfilePersonalInformation(state, fieldName) {
  const fieldValue = state?.vaProfile?.personalInformation?.[fieldName];

  const notListedTextKey = createNotListedTextKey(fieldName);

  const notListedTextValue =
    state?.vaProfile?.personalInformation?.[notListedTextKey];

  if (!fieldValue && !notListedTextValue) return null;

  const result = set({}, fieldName, fieldValue);

  return notListedTextValue
    ? set(result, notListedTextKey, notListedTextValue)
    : result;
}
