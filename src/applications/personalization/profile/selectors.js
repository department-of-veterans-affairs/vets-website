import { toggleValues } from '~/platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';

import {
  cnpDirectDepositBankInfo,
  isEligibleForCNPDirectDeposit,
  isSignedUpForCNPDirectDeposit,
  isSignedUpForEDUDirectDeposit,
} from './util';

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
  return state.vaProfile?.personalInformation?.errors;
};

export const militaryInformationLoadError = state => {
  return state.vaProfile?.militaryInformation?.serviceHistory?.error;
};

export const showDirectDepositV2 = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.directDepositEducation];
