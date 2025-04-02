import * as Sentry from '@sentry/browser';
import ENVIRONMENTS from 'site/constants/environments';
import environment from 'platform/utilities/environment';

export const eauthEnvironmentPrefixes = {
  [ENVIRONMENTS.LOCALHOST]: 'pint.',
  [ENVIRONMENTS.VAGOVDEV]: 'int.',
  [ENVIRONMENTS.VAGOVSTAGING]: 'sqa.',
  [ENVIRONMENTS.VAGOVPROD]: '',
};

export const cernerEnvPrefixes = {
  [ENVIRONMENTS.LOCALHOST]: 'staging-',
  [ENVIRONMENTS.VAGOVDEV]: 'staging-',
  [ENVIRONMENTS.VAGOVSTAGING]: 'staging-',
  [ENVIRONMENTS.VAGOVPROD]: '',
};

export const oracleHealthEnvPrefixes = {
  [ENVIRONMENTS.LOCALHOST]: 'sandbox-',
  [ENVIRONMENTS.VAGOVDEV]: 'sandbox-',
  [ENVIRONMENTS.VAGOVSTAGING]: 'sandbox-',
  [ENVIRONMENTS.VAGOVPROD]: '',
};

export const SKIP_DUPE = 'skip_dupe=true';

export const SKIP_DUPE_QUERY = {
  SINGLE_QUERY: `?${SKIP_DUPE}`,
  MULTIPLE_QUERIES: `&${SKIP_DUPE}`,
};

export const CSP_AUTHN = {
  MHV: 'myhealthevet',
  DS_LOGON: 'dslogon',
};

export const CSP_KEYS = {
  DSLOGON: 'DSLogon',
  LOGINGOV: 'LOGINGOV',
  IDME: 'idme',
  MHV: 'mhv',
};

export const AUTHN_KEYS = {
  IAL: 'ial',
  CSP_TYPE: 'csp_type',
  CSP_METHOD: 'csp_method',
};

export const AUTHN_HEADERS = {
  AUTHN_CONTEXT: 'va_eauth_authncontextclassref',
  CSP: 'va_eauth_csid',
  TRANSACTION_ID: 'va_eauth_transactionid',
  TIMEOUT: 'session-timeout',
  ALIVE: 'session-alive',
  IAL: 'va_eauth_ial',
  CSP_METHOD: 'va_eauth_csp_method',
};

export const SSO_KEEP_ALIVE_ENDPOINT = `https://${
  eauthEnvironmentPrefixes[environment.BUILDTYPE]
}eauth.va.gov/keepalive`;

export const CAUGHT_EXCEPTIONS = {
  'Failed to fetch': {
    LEVEL: Sentry.Severity.Warning,
  },
  'NetworkError when attempting to fetch resource.': {
    LEVEL: Sentry.Severity.Warning,
  },
  'The Internet connection appears to be offline.': {
    LEVEL: Sentry.Severity.Info,
  },
  'The network connection was lost.': {
    LEVEL: Sentry.Severity.Info,
  },
  cancelled: {
    LEVEL: Sentry.Severity.Info,
  },
  default: {
    LEVEL: Sentry.Severity.Error,
  },
};
