import environment from 'platform/utilities/environment';
import { eauthEnvironmentPrefixes } from 'platform/utilities/sso/constants';

const eauthPrefix = eauthEnvironmentPrefixes[environment.BUILDTYPE];

// TODO: Update labs-and-tests route once deep link is provided
const mhvToEauthRoutes = {
  'download-my-data': 'eauth?deeplinking=download_my_data',
  'web/myhealthevet/refill-prescriptions':
    'eauth?deeplinking=prescription_refill',
  'secure-messaging': 'eauth?deeplinking=secure_messaging',
  appointments: 'eauth?deeplinking=appointments',
  home: 'eauth',
  'labs-tests': 'eauth',
};

// An MHV URL is a function that accepts an MHV URL path as a parameter.
function mhvUrl(path) {
  const normPath = path.startsWith('/') ? path.substring(1) : path;
  const eauthDeepLink = mhvToEauthRoutes[normPath];

  return `https://${eauthPrefix}eauth.va.gov/mhv-portal-web/${eauthDeepLink}`;
}

// TODO: This function is NOT SSOe-aware and is a candidate for removal
// after assessing its use in platform/utilities/environment/stagingDomains
const mhvBaseUrl = () => {
  const mhvSubdomain = environment.isProduction() ? 'www' : 'mhv-syst';
  return `https://${mhvSubdomain}.myhealth.va.gov`;
};

export { mhvUrl, mhvBaseUrl };
