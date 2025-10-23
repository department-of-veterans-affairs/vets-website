import { isAuthenticatedWithSSOe } from 'platform/user/authentication/selectors';

// User must be authenticated with SSOe for the proxied/eauth function to work
export const shouldUseProxyUrl = state => isAuthenticatedWithSSOe(state);
