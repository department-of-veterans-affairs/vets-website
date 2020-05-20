import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const profileShowReceiveTextNotifications = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.profileShowReceiveTextNotifications];

export const directDepositInformation = state =>
  state.vaProfile?.paymentInformation;

export const directDepositUiState = state =>
  state.vaProfile?.paymentInformationUiState;

export const directDepositAccountInformation = state =>
  directDepositInformation(state)?.responses?.[0]?.paymentAccount;

export const directDepositIsSetUp = state =>
  !!directDepositAccountInformation(state)?.accountNumber;

export const directDepositAddressInformation = state =>
  directDepositInformation(state)?.responses?.[0]?.paymentAddress;

export const directDepositAddressIsSetUp = state => {
  const addressInfo = directDepositAddressInformation(state);
  return !!(
    addressInfo?.addressOne &&
    addressInfo?.city &&
    addressInfo?.stateCode
  );
};

export const directDepositIsBlocked = state => {
  const controlInfo =
    directDepositInformation(state)?.responses?.[0]?.controlInformation || {};
  return (
    !controlInfo.isCompetentIndicator ||
    !controlInfo.noFiduciaryAssignedIndicator ||
    !controlInfo.notDeceasedIndicator
  );
};
