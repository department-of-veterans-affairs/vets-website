import { trimStart } from 'lodash';

import {
  ssoe,
  ssoeEbenefitsLinks,
} from 'platform/user/authentication/selectors';
import { hasSessionSSO } from 'platform/user/profile/utilities';
import environment from 'platform/utilities/environment';
import { eauthEnvironmentPrefixes } from 'platform/utilities/sso/constants';

const eauthPrefix = eauthEnvironmentPrefixes[environment.BUILDTYPE];
function eauthUrl(path = '') {
  return `https://${eauthPrefix}eauth.va.gov/ebenefits/${trimStart(path, '/')}`;
}

export const eBenefitsUrlGenerator = state => {
  // only proxy the eBenefit URL through eauth.va.gov if the user
  // a) is authenticated
  // b) has the SSOe feature flag enabled
  // c) has the SSOe eBenefits links feature flag enabled
  if (hasSessionSSO() && ssoe(state) && ssoeEbenefitsLinks(state)) {
    return eauthUrl;
  }
  return path => `https://www.ebenefits.va.gov/${trimStart(path, '/')}`;
};
