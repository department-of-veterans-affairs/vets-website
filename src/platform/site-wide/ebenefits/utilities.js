import environment from 'platform/utilities/environment';
import { eauthEnvironmentPrefixes } from 'platform/utilities/sso/constants';

const eauthPrefix = eauthEnvironmentPrefixes[environment.BUILDTYPE];
// mapping of the www.ebenefits.va.gov/<path> path to the same page behind
// the eauth.va.gov/<path> proxy. NOTE: if the path mapping is not defined
// it is assumed that the paths between the two domains are the same
const eauthPathMap = {
  'ebenefits-portal/ebenefits.portal': 'ebenefits/homepage',
  'ebenefits/about/feature?feature=disability-compensation':
    'ebenefits/vdc?target=%2Fwssweb%2FVDC526%2Fcompensation.do',
  'ebenefits/about/feature?feature=vocational-rehabilitation-and-employment':
    'ebenefits/vre',
  'ebenefits/about/feature?feature=direct-deposit-and-contact-information':
    'ebenefits/manage/contact',
  'ebenefits/about/feature?feature=payment-history': 'ebenefits/payments',
  'ebenefits/about/feature?feature=dependent-compensation':
    'ebenefits/vdc?target=%2Fwssweb%2Fwss-686-webparts%2Fdependent.do',
  'ebenefits/about/feature?feature=cert-of-eligibility-home-loan':
    'ebenefits/coe',
  // NOTE: Future use; these links only exist in the content repo, so they
  // can't be dynamically created.  However if those pages get moved over
  // they we will have them mapped
  'ebenefits/about/feature?feature=request-vso-representative':
    'ebenefits/vdc?target=%2Fwssweb%2FVDC2122%2Frepresentative.do',
  'ebenefits/about/feature?feature=hearing-aid-batteries-and-prosthetic-socks':
    'ebenefits/OrderMedicalEquip',
  'ebenefits/about/feature?feature=sah-grant': 'ebenefits/SAH',
  'ebenefits/about/feature?feature=vgli-policy-management':
    'isam/sps/saml20idp/saml20/logininitial?PartnerId=https://fedsso-qa.prudential.com/cu&Target=https://giosgli-stage.prudential.com/osgli/Controller/eBenefitsUser',
};
function normalizePath(path) {
  // remove the leading '/' prefix if it exists
  return path.startsWith('/') ? path.substring(1) : path;
}
function proxyUrl(path = 'ebenefits') {
  // render an absolute url to the given path under the proxy server.
  // if a path mapping can't be found, use it as is
  const route = eauthPathMap[normalizePath(path)] || normalizePath(path);
  return `https://${eauthPrefix}eauth.va.gov/${route}`;
}
function defaultUrl(path = '') {
  return `https://www.ebenefits.va.gov/${normalizePath(path)}`;
}

export { proxyUrl, defaultUrl };
