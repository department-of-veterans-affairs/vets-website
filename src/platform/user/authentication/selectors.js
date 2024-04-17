import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { selectProfile } from 'platform/user/selectors';
import { infoTokenExists } from 'platform/utilities/oauth/utilities';

export const hasCheckedKeepAlive = state =>
  state.user.login.hasCheckedKeepAlive;

export const signInServiceName = state =>
  selectProfile(state).signIn?.serviceName;

export const isAuthenticatedWithSSOe = state =>
  selectProfile(state)?.session?.ssoe;

export const isAuthenticatedWithOAuth = state =>
  selectProfile(state)?.session?.authBroker === 'sis' || infoTokenExists();

export const ssoeTransactionId = state =>
  selectProfile(state)?.session?.transactionid;

export const signInServiceEnabled = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.signInServiceEnabled];

export const termsOfUseEnabled = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.termsOfUse];
