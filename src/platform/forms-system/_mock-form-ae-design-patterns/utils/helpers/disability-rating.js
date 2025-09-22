/**
 * Determine if error code is a client error
 * @param {Number/String} errCode - the error code from the request response
 * @returns {Boolean} - true if error code is in the 400-499 range
 */
export function isClientError(errCode = '') {
  const CLIENT_ERROR_REGEX = /^4\d{2}$/;
  return CLIENT_ERROR_REGEX.test(errCode);
}

/**
 * Determine if error code is a server error
 * @param {Number/String} errCode - the error code from the request response
 * @returns {Boolean} - true if error code is in the 500-599 range
 */
export function isServerError(errCode = '') {
  const SERVER_ERROR_REGEX = /^5\d{2}$/;
  return SERVER_ERROR_REGEX.test(errCode);
}

/**
 * Parse error details on failure of total disability rating fetch
 * @param {Object} response - object containing either an array of errors or a
 * single error object
 * @returns {Oject} - the error code and error details from the first error in
 * the response, or NULL if no errors are present
 */
export function parseResponseErrors(response = {}) {
  const { errors = null, error, status } = response;
  if (errors?.length) {
    const { code, detail } = errors[0];
    return { code, detail };
  }
  if (error) {
    return { code: status, detail: error };
  }
  return null;
}
