import {
  AUTH_ERROR_CODES,
  OTC_ERROR_CODES,
  SERVER_ERROR_CODES,
  AVAILABILITY_ERROR_CODES,
  APPOINTMENT_ERROR_CODES,
} from './constants';

/**
 * @typedef {Object} Error
 * @property {string} code
 * @property {string} detail
 */

/**
 * @param {Error Object} error
 * @returns {boolean}
 */
const isInvalidCredentialsError = error => {
  return error?.code === AUTH_ERROR_CODES.INVALID_CREDENTIALS;
};

const isRateLimitExceededError = error => {
  return error?.code === AUTH_ERROR_CODES.RATE_LIMIT_EXCEEDED;
};

const isMissingParameterError = error => {
  return (
    error?.code === AUTH_ERROR_CODES.MISSING_PARAMETER ||
    error?.code === OTC_ERROR_CODES.MISSING_PARAMETER ||
    error?.code === AVAILABILITY_ERROR_CODES.MISSING_PARAMETER ||
    error?.code === APPOINTMENT_ERROR_CODES.MISSING_PARAMETER
  );
};

const isAccountLockedError = error => {
  return error?.code === OTC_ERROR_CODES.ACCOUNT_LOCKED;
};

const isServerError = error => {
  return (
    Object.values(SERVER_ERROR_CODES).includes(error?.code) ||
    error?.status >= 500
  );
};

const isNotWhithinCohortError = error => {
  return error?.code === AVAILABILITY_ERROR_CODES.NOT_WITHIN_COHORT;
};

const isAppointmentFailedError = error => {
  return error?.code === APPOINTMENT_ERROR_CODES.APPOINTMENT_SAVE_FAILED;
};

const isAppointmentNotFoundError = error => {
  return error?.code === APPOINTMENT_ERROR_CODES.APPOINTMENT_NOT_FOUND;
};

export {
  isInvalidCredentialsError,
  isRateLimitExceededError,
  isMissingParameterError,
  isAccountLockedError,
  isServerError,
  isNotWhithinCohortError,
  isAppointmentFailedError,
  isAppointmentNotFoundError,
};
