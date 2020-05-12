import {
  ssoe,
  ssoeEbenefitsLinks,
} from 'platform/user/authentication/selectors';
import { isLoggedIn } from 'platform/user/selectors';

// the following criteria must be true for the proxied/eauth function
// a) user is authenticated
// b) the SSOe feature flag enabled
// c) the SSOe eBenefits links feature flag enabled
export const shouldUseProxyUrl = state =>
  isLoggedIn(state) && ssoe(state) && ssoeEbenefitsLinks(state);
