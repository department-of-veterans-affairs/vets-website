const VASS_PHONE_NUMBER = '8008270611';

const URLS = Object.freeze({
  VERIFY: '/',
  ENTER_OTP: '/enter-otp',
  DATE_TIME: '/date-time',
  TOPIC_SELECTION: '/topic-selection',
  REVIEW: '/review',
  CONFIRMATION: '/confirmation',
  CANCEL_APPOINTMENT: '/cancel-appointment',
  CANCEL_APPOINTMENT_CONFIRMATION: '/cancel-appointment/confirmation',
  ALREADY_SCHEDULED: '/already-scheduled',
});

const FLOW_TYPES = {
  SCHEDULE: 'schedule',
  CANCEL: 'cancel',
  ANY: 'any',
};

/**
 * Authorization level enum for route protection.
 * @readonly
 * @enum {string}
 */
const AUTH_LEVELS = {
  /** No authentication required - public route */
  NONE: 'none',
  /** Requires a valid authentication token */
  TOKEN: 'token',
};

const VASS_TOKEN_COOKIE_NAME = 'VASS_TOKEN';

const isProduction = process.env.NODE_ENV === 'production';

const VASS_COOKIE_OPTIONS = {
  secure: isProduction,
  sameSite: isProduction ? 'strict' : undefined,
  path: '/',
};

/**
 * VASS API Error Codes
 */

// Authentication errors (POST /vass/v0/request-otp, POST /vass/v0/authenticate)
const AUTH_ERROR_CODES = Object.freeze({
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  INVALID_CREDENTIALS: 'invalid_credentials',
  MISSING_PARAMETER: 'missing_parameter',
});

// OTP Verification errors (POST /vass/v0/authenticate-otp)
const OTP_ERROR_CODES = Object.freeze({
  INVALID_OTP: 'invalid_otp',
  ACCOUNT_LOCKED: 'account_locked',
  OTP_EXPIRED: 'otp_expired',
  MISSING_PARAMETER: 'missing_parameter',
});

// Token errors (POST /vass/v0/revoke-token)
const TOKEN_ERROR_CODES = Object.freeze({
  INVALID_TOKEN: 'invalid_token',
  UNAUTHORIZED: 'unauthorized',
});

// Appointment availability errors (GET /vass/v0/appointment-availability)
const AVAILABILITY_ERROR_CODES = Object.freeze({
  APPOINTMENT_ALREADY_BOOKED: 'appointment_already_booked',
  NOT_WITHIN_COHORT: 'not_within_cohort',
  NO_SLOTS_AVAILABLE: 'no_slots_available',
});

// Appointment errors (POST/GET /vass/v0/appointment /vass/v0/appointment/:appointmentId/cancel)
const APPOINTMENT_ERROR_CODES = Object.freeze({
  APPOINTMENT_SAVE_FAILED: 'appointment_save_failed',
  APPOINTMENT_NOT_FOUND: 'appointment_not_found',
  CANCELLATION_FAILED: 'cancellation_failed',
  MISSING_PARAMETER: 'missing_parameter',
});

// External service / server errors
const SERVER_ERROR_CODES = Object.freeze({
  VASS_API_ERROR: 'vass_api_error',
  SERVICE_ERROR: 'service_error',
});

module.exports = {
  VASS_PHONE_NUMBER,
  URLS,
  FLOW_TYPES,
  AUTH_LEVELS,
  VASS_TOKEN_COOKIE_NAME,
  VASS_COOKIE_OPTIONS,
  AUTH_ERROR_CODES,
  OTP_ERROR_CODES,
  TOKEN_ERROR_CODES,
  AVAILABILITY_ERROR_CODES,
  APPOINTMENT_ERROR_CODES,
  SERVER_ERROR_CODES,
};
