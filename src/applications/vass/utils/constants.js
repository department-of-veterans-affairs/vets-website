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
