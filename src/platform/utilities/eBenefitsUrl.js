import {
  ssoe,
  ssoeEbenefitsLinks,
} from 'platform/user/authentication/selectors';
import { hasSessionSSO } from 'platform/user/profile/utilities';
import environment from 'platform/utilities/environment';
import { eauthEnvironmentPrefixes } from 'platform/utilities/sso/constants';

const eauthPrefix = eauthEnvironmentPrefixes[environment.BUILDTYPE];
const eauthPathMap = {
  'ebenefits-portal/ebenefits.portal': 'homepage',
};
function normalizePath(path) {
  return path.startswith('/') ? path.substring(1) : path;
}
function eauthUrl(path = '') {
  const route = eauthPathMap[normalizePath(path)] || normalizePath(path);
  return `https://${eauthPrefix}eauth.va.gov/ebenefits/${route}`;
}

export const eBenefitsUrlGenerator = state => {
  // only proxy the eBenefit URL through eauth.va.gov if the user
  // a) is authenticated
  // b) has the SSOe feature flag enabled
  // c) has the SSOe eBenefits links feature flag enabled
  if (hasSessionSSO() && ssoe(state) && ssoeEbenefitsLinks(state)) {
    return eauthUrl;
  }
  return path => `https://www.ebenefits.va.gov/${normalizePath(path)}`;
};
