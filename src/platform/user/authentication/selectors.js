import { selectProfile } from 'platform/user/selectors';

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
