import { getData } from '../config/utilities';

export const VERIFY_VA_FILE_NUMBER_STARTED = 'VERIFY_VA_FILE_NUMBER_STARTED';
export const VERIFY_VA_FILE_NUMBER_SUCCEEDED =
  'VERIFY_VA_FILE_NUMBER_SUCCEEDED';
export const VERIFY_VA_FILE_NUMBER_FAILED = 'VERIFY_VA_FILE_NUMBER_FAILED';

/**
 * Gets the veteran's VA file number validity status from the profile service.
 * (VA file number is required to create a valid entry in BGS)
 * @returns {Promise<object>} Response object from the /profile/valid_va_file_number endpoint
 */
async function getVaFileNumber() {
  return getData('/profile/valid_va_file_number');
}

/**
 * Fetch state of VA file number validity
 * @returns {Promise<void>} Thunk action to verify the veteran's VA file number
 */
export const verifyVaFileNumber = () => async dispatch => {
  dispatch({ type: VERIFY_VA_FILE_NUMBER_STARTED, response: true });
  const response = await getVaFileNumber();
  if (response.errors) {
    dispatch({ type: VERIFY_VA_FILE_NUMBER_FAILED, response });
  } else {
    // account for validVaFileNumber and validVAFileNumber inflection
    const unifiedResponse = {};
    for (const [key, value] of Object.entries(response)) {
      unifiedResponse[key.toUpperCase()] = value;
    }
    dispatch({
      type: VERIFY_VA_FILE_NUMBER_SUCCEEDED,
      response: unifiedResponse,
    });
  }
};
