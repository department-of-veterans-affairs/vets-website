import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from 'platform/utilities/api';
import environment from '~/platform/utilities/environment';

export const FETCH_FORM_STATUS_STARTED = 'FETCH_FORM_STATUS_STARTED';
export const FETCH_FORM_STATUS_SUCCEEDED = 'FETCH_FORM_STATUS_SUCCEEDED';
export const FETCH_FORM_STATUS_FAILED = 'FETCH_FORM_STATUS_FAILED';

const RECORD_PROPS = {
  event: `api_call`,
  'api-name': 'GET form submission status',
};

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

const actionStart = () => ({ type: FETCH_FORM_STATUS_STARTED });

const actionFail = errors => ({
  type: FETCH_FORM_STATUS_FAILED,
  errors,
});

const actionSuccess = response => ({
  type: FETCH_FORM_STATUS_SUCCEEDED,
  forms: response.data,
  errors: response.errors,
});

const recordFail = (errorKey = 'server error') =>
  recordEvent({
    ...RECORD_PROPS,
    'error-key': errorKey,
    'api-status': 'failed',
  });

const recordSuccess = () =>
  recordEvent({
    ...RECORD_PROPS,
    'api-status': 'successful',
  });

export const fetchFormStatuses = () => async dispatch => {
  dispatch(actionStart());
  try {
    const response = await getForms();
    recordSuccess();
    return dispatch(actionSuccess(response));
  } catch (error) {
    recordFail('internal error');
    dispatch(actionFail(error));
    throw new Error(error);
  }
};
