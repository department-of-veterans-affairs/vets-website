import {
  ssoe,
  ssoeEbenefitsLinks,
} from 'platform/user/authentication/selectors';
import { hasSessionSSO } from 'platform/user/profile/utilities';

// the following criteria must be true for the proxied/eauth function
// a) user is authenticated
// b) the SSOe feature flag enabled
// c) the SSOe eBenefits links feature flag enabled
export const shouldUseProxyUrl = state =>
  hasSessionSSO() && ssoe(state) && ssoeEbenefitsLinks(state);
