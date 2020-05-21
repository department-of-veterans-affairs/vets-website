import environment from 'platform/utilities/environment';
import { eauthEnvironmentPrefixes } from 'platform/utilities/sso/constants';

const eauthPrefix = eauthEnvironmentPrefixes[environment.BUILDTYPE];
const mhvPrefix = environment.isProduction() ? 'www' : 'mhv-syst';

// TODO: Add labs-and-tests route
const mhvToEauthRoutes = {
  'download-my-data': 'eauth?deeplinking=download_my_data',
  'web/myhealthevet/refill-prescriptions':
    'eauth?deeplinking=prescription_refill',
  'secure-messaging': 'eauth?deeplinking=secure_messaging',
  appointments: 'eauth?deeplinking=appointments',
  home: 'eauth',
};

// An MHV URL is a function of the following parameters:
// 1. Whether this is a production or staging environment
// 2. Whether SSOe is in use (enabled site wide, and for this particular user)
// 3. The specific MHV path being accessed
function mhvUrl(useSSOe, path) {
  const normPath = path.startsWith('/') ? path.substring(1) : path;
  if (useSSOe) {
    const eauthDeepLink = mhvToEauthRoutes[normPath];
    return `https://${eauthPrefix}eauth.va.gov/mhv-portal-web/${eauthDeepLink}`;
  }
  return `https://${mhvPrefix}.myhealth.va.gov/mhv-portal-web/${normPath}`;
}

// TODO: This function is NOT SSOe-aware and is a candidate for removal
// after assessing its use in platform/utilities/environment/stagingDomains
const mhvBaseUrl = () => {
  const mhvSubdomain = environment.isProduction() ? 'www' : 'mhv-syst';
  return `https://${mhvSubdomain}.myhealth.va.gov`;
};

export { mhvUrl, mhvBaseUrl };
