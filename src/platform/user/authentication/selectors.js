import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { selectProfile } from 'platform/user/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const loginGov = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.loginGov];

export const loginGovDisabled = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.loginGovDisabled];

export const loginGovCreateAccount = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.loginGovCreateAccount];

export const loginGovMyVAHealth = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.loginGovMyVAHealth];

export const hasCheckedKeepAlive = state =>
  state.user.login.hasCheckedKeepAlive;

export const signInServiceName = state =>
  selectProfile(state).signIn?.serviceName;

export const isAuthenticatedWithSSOe = state =>
  selectProfile(state)?.session?.ssoe;

export const ssoeTransactionId = state =>
  selectProfile(state)?.session?.transactionid;

export const transitionMHVAccount = state =>
  selectProfile(state)?.mhvTransitionEligible;
