import { isAuthenticatedWithSSOe } from 'platform/user/authentication/selectors';

// the following criteria must be true for the proxied/eauth function
// a) user is authenticated with SSOe
// b) the SSOe eBenefits links feature flag enabled
export const shouldUseProxyUrl = state =>
  Boolean(isAuthenticatedWithSSOe(state));
