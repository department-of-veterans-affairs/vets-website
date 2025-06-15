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
