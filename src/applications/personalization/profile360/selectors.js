import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const profileShowDirectDeposit = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.profileShowDirectDeposit];

export const profileShowReceiveTextNotifications = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.profileShowReceiveTextNotifications];

export const directDepositInformation = state =>
  state.vaProfile?.paymentInformation;

export const directDepositAccountInformation = state =>
  directDepositInformation(state)?.responses[0]?.paymentAccount;

export const directDepositIsSetUp = state =>
  !!directDepositAccountInformation(state)?.accountNumber;
