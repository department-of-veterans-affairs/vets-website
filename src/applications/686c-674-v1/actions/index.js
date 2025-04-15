import recordEvent from 'platform/monitoring/record-event';
import * as Sentry from '@sentry/browser';
import { getData } from '../util';

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
  let response = await getVaFileNumber();
  if (response.errors) {
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
    // account for validVaFileNumber and validVAFileNumber inflection
    const unifiedResponse = {};
    for (const [key, value] of Object.entries(response)) {
      unifiedResponse[key.toUpperCase()] = value;
    }
    response = unifiedResponse;
    dispatch({ type: VERIFY_VA_FILE_NUMBER_SUCCEEDED, response });
  }
};
