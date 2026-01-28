export const VASS_PHONE_NUMBER = '8008270611';

export const URLS = Object.freeze({
  VERIFY: '/',
  ENTER_OTC: '/enter-otc',
  DATE_TIME: '/date-time',
  TOPIC_SELECTION: '/topic-selection',
  REVIEW: '/review',
  CONFIRMATION: '/confirmation',
  CANCEL_APPOINTMENT: '/cancel-appointment',
  CANCEL_APPOINTMENT_CONFIRMATION: '/cancel-appointment/confirmation',
  ALREADY_SCHEDULED: '/already-scheduled',
});

export const FLOW_TYPES = {
  SCHEDULE: 'schedule',
  CANCEL: 'cancel',
  ANY: 'any',
};

/**
 * Authorization level enum for route protection.
 * @readonly
 * @enum {string}
 */
export const AUTH_LEVELS = {
  /** No authentication required - public route */
  NONE: 'none',
  /** Requires form data (uuid, lastname, dob) but not a token. Redirects authenticated users away. */
  LOW_AUTH_ONLY: 'lowAuthOnly',
  /** Requires a valid authentication token */
  TOKEN: 'token',
};

export const VASS_TOKEN_COOKIE_NAME = 'VASS_TOKEN';

const isProduction = process.env.NODE_ENV === 'production';

export const VASS_COOKIE_OPTIONS = {
  secure: isProduction,
  sameSite: isProduction ? 'strict' : undefined,
  path: '/',
  ...(isProduction ? { domain: 'va.gov' } : {}),
};
