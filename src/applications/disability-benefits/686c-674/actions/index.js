import recordEvent from 'platform/monitoring/record-event';
import { getData } from '../util';
import * as Sentry from '@sentry/browser';

export const VERIFY_VA_FILE_NUMBER_STARTED = 'VERIFY_VA_FILE_NUMBER_STARTED';
export const VERIFY_VA_FILE_NUMBER_SUCCEEDED =
  'VERIFY_VA_FILE_NUMBER_SUCCEEDED';
export const VERIFY_VA_FILE_NUMBER_FAILED = 'VERIFY_VA_FILE_NUMBER_FAILED';

// VA file number is required to create a valid entry in BGS.
async function getVaFileNumber() {
  return getData('/profile/valid_va_file_number');
}

export const verifyVaFileNumber = () => async dispatch => {
  dispatch({ type: VERIFY_VA_FILE_NUMBER_STARTED, response: true });
  const response = await getVaFileNumber();
  if (response.errors) {
    // TODO: fire off analytics event when endpoint is wired up.
    //   const errCode = res.errors[0].code;
    //   isServerError(errCode) ? recordEvent({}) : recordEvent({})
    Sentry.captureMessage('disability-file-number-gate-failed');
    recordEvent({
      event: 'disability-file-number-gate-failed',
      'error-key': `${response.errors[0].code}_error_description`,
    });
    dispatch({ type: VERIFY_VA_FILE_NUMBER_FAILED, response });
  } else {
    Sentry.captureMessage('disability-file-number-gate-successful');
    recordEvent({
      event: 'disability-file-number-gate-successful',
    });
    dispatch({ type: VERIFY_VA_FILE_NUMBER_SUCCEEDED, response });
  }
};
