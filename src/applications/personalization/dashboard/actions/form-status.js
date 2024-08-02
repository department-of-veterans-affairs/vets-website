import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from 'platform/utilities/api';
import environment from '~/platform/utilities/environment';

export const FETCH_FORM_STATUS_STARTED = 'FETCH_FORM_STATUS_STARTED';
export const FETCH_FORM_STATUS_SUCCEEDED = 'FETCH_FORM_STATUS_SUCCEEDED';
export const FETCH_FORM_STATUS_FAILED = 'FETCH_FORM_STATUS_FAILED';

export const fetchFormStatuses = () => async dispatch => {
  dispatch({ type: FETCH_FORM_STATUS_STARTED });

  const getForms = () => {
    const options = {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
        'Source-App-Name': window.appName,
      },
    };

    return apiRequest(
      `${environment.API_URL}/v0/my_va/submission_statuses`,
      options,
    );
  };

  try {
    const { errors, data } = await getForms();

    if (errors) {
      recordEvent({
        event: `api_call`,
        'error-key': `server error`,
        'api-name': 'GET form submission status',
        'api-status': 'failed',
      });
      return dispatch({
        type: FETCH_FORM_STATUS_FAILED,
        errors,
      });
    }

    recordEvent({
      event: `api_call`,
      'api-name': 'GET form submission status',
      'api-status': 'successful',
    });

    return dispatch({
      type: FETCH_FORM_STATUS_SUCCEEDED,
      forms: data,
    });
  } catch (error) {
    recordEvent({
      event: `api_call`,
      'error-key': `internal error`,
      'api-name': 'GET form submission status',
      'api-status': 'failed',
    });
    dispatch({
      type: FETCH_FORM_STATUS_FAILED,
      errors: [error],
    });
    throw new Error(error);
  }
};
