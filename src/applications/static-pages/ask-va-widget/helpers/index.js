// Relative imports.
import environment from 'platform/utilities/environment';

export const deriveDefaultURL = () => {
  // Production environments.
  if (environment.isProduction()) {
    return 'https://ask.va.gov';
  }

  // Non-production environments.
  return 'https://dvagov-veft-qa.dynamics365portals.us/';
};

export const deriveLOA1URL = () => {
  // Production environments.
  if (environment.isProduction()) {
    return 'https://ask.va.gov/unauthenticated';
  }

  // Non-production environments.
  return 'https://dvagov-veft-qa.dynamics365portals.us/unauthenticated';
};

export const deriveLOA2PlusURL = () => {
  // Production environments.
  if (environment.isProduction()) {
    return 'https://eauth.va.gov/isam/sps/saml20idp/saml20/logininitial?PartnerId=https://prod-va-gov-sso.portals.va.gov/ava/SSO/Metadata/';
  }

  // Non-production environments.
  return 'https://sqa.eauth.va.gov/isam/sps/saml20idp/saml20/logininitial?PartnerId=https://iam-ssoe-sqa1-veis.devtest.vaec.va.gov/ava/SSO/Metadata/';
};
