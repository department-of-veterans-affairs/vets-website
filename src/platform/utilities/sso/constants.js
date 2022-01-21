import * as Sentry from '@sentry/browser';
import ENVIRONMENTS from 'site/constants/environments';
import environment from '../../utilities/environment';

export const eauthEnvironmentPrefixes = {
  [ENVIRONMENTS.LOCALHOST]: 'pint.',
  [ENVIRONMENTS.VAGOVDEV]: 'int.',
  [ENVIRONMENTS.VAGOVSTAGING]: 'sqa.',
  [ENVIRONMENTS.VAGOVPROD]: '',
};

export const MHV_SKIP_DUPE = '?skip_dupe=mhv';

export const CSP_AUTHN = {
  MHV: 'myhealthevet',
  DS_LOGON: 'dslogon',
};

export const AUTHN_HEADERS = {
  AUTHN_CONTEXT: 'va_eauth_authncontextclassref',
  CSP: 'va_eauth_csid',
  TRANSACTION_ID: 'va_eauth_transactionid',
  TIMEOUT: 'session-timeout',
  ALIVE: 'session-alive',
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
