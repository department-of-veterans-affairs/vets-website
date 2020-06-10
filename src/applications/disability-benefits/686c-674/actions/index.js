// import recordEvent from 'platform/monitoring/record-event';
// import { isServerError, isClientError } from '../config/utilities';
import { getData, isServerError, isClientError } from '../util';

export const VERIFY_VA_FILE_NUMBER_STARTED = 'VERIFY_VA_FILE_NUMBER_STARTED';
export const VERIFY_VA_FILE_NUMBER_SUCCEEDED =
  'VERIFY_VA_FILE_NUMBER_SUCCEEDED';
export const VERIFY_VA_FILE_NUMBER_FAILED = 'VERIFY_VA_FILE_NUMBER_FAILED';

// VA file number is required to create a valid entry in BGS.
async function getVaFileNumber() {
  const response = await getData('/profile/va_file_number');
  return response;
}

export const verifyVaFileNumber = () => async dispatch => {
  dispatch({ type: VERIFY_VA_FILE_NUMBER_STARTED, response: true });
  const response = await getVaFileNumber();
  if (response.errors) {
    // TODO: fire off analytics event when endpoint is wired up.
    //   const errCode = res.errors[0].code;
    //   isServerError(errCode) ? recordEvent({}) : recordEvent({})
    dispatch({ type: VERIFY_VA_FILE_NUMBER_FAILED, response });
  } else {
    dispatch({ type: VERIFY_VA_FILE_NUMBER_SUCCEEDED, response });
  }
};
