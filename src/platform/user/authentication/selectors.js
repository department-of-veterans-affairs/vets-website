import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { selectProfile } from 'platform/user/selectors';

export const hasCheckedKeepAlive = state =>
  state.user.login.hasCheckedKeepAlive;

export const signInServiceName = state =>
  selectProfile(state).signIn?.serviceName;

export const isAuthenticatedWithSSOe = state =>
  selectProfile(state)?.session?.ssoe;

export const isAuthenticatedWithOAuth = state =>
  selectProfile(state)?.session?.authBroker === 'sis';

export const ssoeTransactionId = state =>
  selectProfile(state)?.session?.transactionid;

export const transitionMHVAccount = state =>
  selectProfile(state)?.mhvTransitionEligible;

export const signInServiceEnabled = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.signInServiceEnabled];
