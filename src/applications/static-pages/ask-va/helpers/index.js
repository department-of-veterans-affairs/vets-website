// Relative imports.
import environment from 'platform/utilities/environment';

export const deriveLOA1URL = () => {
  // Production environments.
  if (environment.isProduction()) {
    return 'https://ava.va.gov/Unauthenticated';
  }

  // Non-production environments.
  return 'https://ask-staging.va.gov/Unauthenticated';
};

export const deriveLOA2PlusURL = () => {
  // Production environments.
  if (environment.isProduction()) {
    return 'https://eauth.va.gov/isam/sps/saml20idp/saml20/logininitial?PartnerId=https://prod-va-gov-sso.portals.va.gov/ava/SSO/Metadata/';
  }

  // Non-production environments.
  return 'https://preprod.eauth.va.gov/isam/sps/saml20idp/saml20/logininitial?PartnerId=https://preprod-va-gov-sso.portals.va.gov/ava/SSO/Metadata/';
};

export const deriveDefaultURL = () => {
  // Production environments.
  if (environment.isProduction()) {
    return 'https://ava.va.gov/';
  }

  // Non-production environments.
  return 'https://ask-staging.va.gov';
};
