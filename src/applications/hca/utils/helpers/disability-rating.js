import recordEvent from 'platform/monitoring/record-event';
import { DISABILITY_PREFIX } from '../constants';

/**
 * Determine if error code is a client error
 * @param {Number/String} errCode - the error code from the request response
 * @returns {Boolean} - true if error code is in the 400-499 range
 */
export const isClientError = (errCode = '') => {
  const CLIENT_ERROR_REGEX = /^4\d{2}$/;
  return CLIENT_ERROR_REGEX.test(errCode);
};

/**
 * Determine if error code is a server error
 * @param {Number/String} errCode - the error code from the request response
 * @returns {Boolean} - true if error code is in the 500-599 range
 */
export const isServerError = (errCode = '') => {
  const SERVER_ERROR_REGEX = /^5\d{2}$/;
  return SERVER_ERROR_REGEX.test(errCode);
};

/**
 * Parse error details on failure of total disability rating fetch
 * @param {Object} response - object containing either an array of errors or a
 * single error object
 * @returns {Oject} - the error code and error details from the first error in
 * the response, or NULL if no errors are present
 */
export const parseResponseErrors = (response = {}) => {
  const { errors, error, status } = response;
  if (errors?.length) {
    return { code: errors[0].code, detail: errors[0].detail };
  }
  return error ? { code: status, detail: error } : { code: null, detail: null };
};

/**
 * Logging method for failed disability rating fetch
 * @param {Number/String} errCode - the error code from the request response
 * @returns {Boolean} - true if error code is in the 500-599 range
 */
export const logFetchError = errCode => {
  let message;

  if (isServerError(errCode)) {
    message = `${errCode} internal error`;
  } else if (isClientError(errCode)) {
    message = `${errCode} no combined rating found`;
  }

  recordEvent({
    event: `${DISABILITY_PREFIX}-combined-load-failed`,
    'error-key': message,
  });
};
