import environment from 'platform/utilities/environment';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { selectProfile } from 'platform/user/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const ssoe = state => toggleValues(state)[FEATURE_FLAG_NAMES.ssoe];

export const ssoeInbound = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.ssoeInbound];

export const ssoeEbenefitsLinks = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.ssoeEbenefitsLinks];

export const hasCheckedKeepAlive = state =>
  state.user.login.hasCheckedKeepAlive;

export const signInServiceName = state =>
  selectProfile(state).signIn?.serviceName;

export const isAuthenticatedWithSSOe = state =>
  selectProfile(state).signIn?.ssoe;
