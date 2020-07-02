import environment from 'platform/utilities/environment';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { selectProfile } from 'platform/user/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const ssoe = state => toggleValues(state)[FEATURE_FLAG_NAMES.ssoe];

export const ssoeInbound = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.ssoeInbound] &&
  !environment.isLocalhost();

export const ssoeEbenefitsLinks = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.ssoeEbenefitsLinks];

// While SSOe isn't 100% enabled, this helps differentiate in session types
// and whether or not to trigger inbound SSO logouts
export const isAuthenticatedWithSSOe = state =>
  selectProfile(state).signIn?.ssoe;

export const hasCheckedKeepAlive = state =>
  state.user.login.hasCheckedKeepAlive;

export const signInServiceName = state =>
  selectProfile(state).signIn?.serviceName;
