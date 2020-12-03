import {
  directDepositBankInfo,
  isEligibleForDirectDeposit,
  isSignedUpForDirectDeposit,
} from './util';

export const directDepositInformation = state =>
  state.vaProfile?.paymentInformation;

export const directDepositUiState = state =>
  state.vaProfile?.paymentInformationUiState;

export const directDepositAccountInformation = state =>
  directDepositBankInfo(directDepositInformation(state));

export const directDepositIsSetUp = state =>
  isSignedUpForDirectDeposit(directDepositInformation(state));

export const directDepositLoadError = state =>
  directDepositInformation(state)?.error;

export const directDepositAddressInformation = state =>
  directDepositInformation(state)?.responses?.[0]?.paymentAddress;

export const directDepositAddressIsSetUp = state => {
  return isEligibleForDirectDeposit(directDepositInformation(state));
};

export const directDepositIsBlocked = state => {
  const controlInfo = directDepositInformation(state)?.responses?.[0]
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
