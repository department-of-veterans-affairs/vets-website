import { captureError } from '@@vap-svc/util/analytics';

import { getData } from '~/platform/user/profile/utilities';

import { API_STATUS } from '../constants';
import { DirectDepositClient } from '../util/direct-deposit';

// action types for direct deposit information

// fetch actions
export const DIRECT_DEPOSIT_FETCH_STARTED = 'DIRECT_DEPOSIT_FETCH_STARTED';
export const DIRECT_DEPOSIT_FETCH_SUCCEEDED = 'DIRECT_DEPOSIT_FETCH_SUCCEEDED';
export const DIRECT_DEPOSIT_FETCH_FAILED = 'DIRECT_DEPOSIT_FETCH_FAILED';

// save actions
export const DIRECT_DEPOSIT_SAVE_STARTED =
  'DIRECT_DEPOSIT_INFORMATION_SAVE_STARTED';
export const DIRECT_DEPOSIT_SAVE_SUCCEEDED = 'DIRECT_DEPOSIT_SAVE_SUCCEEDED';
export const DIRECT_DEPOSIT_SAVE_FAILED = 'DIRECT_DEPOSIT_SAVE_FAILED';

// edit actions for ui state
export const DIRECT_DEPOSIT_EDIT_TOGGLED = 'DIRECT_DEPOSIT_EDIT_TOGGLED';

// clear error actions
export const DIRECT_DEPOSIT_LOAD_ERROR_CLEARED =
  'DIRECT_DEPOSIT_LOAD_ERROR_CLEARED';
export const DIRECT_DEPOSIT_SAVE_ERROR_CLEARED =
  'DIRECT_DEPOSIT_SAVE_ERROR_CLEARED';

// API endpoint for fetching and updating direct deposit information
export const DIRECT_DEPOSIT_API_ENDPOINT = '/profile/direct_deposits';

export const fetchDirectDepositArgs = {
  captureError,
  getData,
};

const client = new DirectDepositClient();
// action creator to fetch direct deposit information
export function fetchDirectDeposit({
  captureError: captureDirectDepositError,
} = fetchDirectDepositArgs) {
  return async dispatch => {
    dispatch({ type: DIRECT_DEPOSIT_FETCH_STARTED });
    dispatch({ type: DIRECT_DEPOSIT_LOAD_ERROR_CLEARED });
    dispatch({ type: DIRECT_DEPOSIT_SAVE_ERROR_CLEARED });

    client.recordDirectDepositEvent({
      endpoint: DIRECT_DEPOSIT_API_ENDPOINT,
      status: API_STATUS.STARTED,
    });

    const response = await getData(DIRECT_DEPOSIT_API_ENDPOINT);

    if (response.error || response.errors || response instanceof Error) {
      client.recordDirectDepositEvent({
        endpoint: DIRECT_DEPOSIT_API_ENDPOINT,
        status: API_STATUS.FAILED,
      });

      captureDirectDepositError(response, {
        eventName: 'get-direct-deposit-failed',
      });

      dispatch({
        type: DIRECT_DEPOSIT_FETCH_FAILED,
        response,
      });
    } else {
      client.recordDirectDepositEvent({
        endpoint: DIRECT_DEPOSIT_API_ENDPOINT,
        status: API_STATUS.SUCCESSFUL,
        extraProperties: {
          veteranStatus: response?.veteranStatus || 'status-unknown',
        },
      });

      dispatch({
        type: DIRECT_DEPOSIT_FETCH_SUCCEEDED,
        response,
      });
    }
  };
}

// action creator to save direct deposit information
export function saveDirectDeposit(
  data,
  {
    captureError: captureDirectDepositError,
    getData: getDataDirectDeposit,
  } = fetchDirectDepositArgs,
) {
  return async dispatch => {
    dispatch({ type: DIRECT_DEPOSIT_SAVE_STARTED });

    client.recordDirectDepositEvent({
      endpoint: DIRECT_DEPOSIT_API_ENDPOINT,
      status: API_STATUS.STARTED,
      method: 'PUT',
    });

    const response = await getDataDirectDeposit(DIRECT_DEPOSIT_API_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // for client side errors
    // check if response is an instance of an error TypeError or any other error
    if (response instanceof Error) {
      const event = {
        method: 'PUT',
        endpoint: DIRECT_DEPOSIT_API_ENDPOINT,
        status: API_STATUS.FAILED,
        extraProperties: {
          'error-key':
            response?.message || 'unknown-error error instance message',
        },
      };

      client.recordDirectDepositEvent(event);

      captureDirectDepositError(response.message, {
        eventName: 'put-direct-deposit-failed',
      });

      dispatch({
        type: DIRECT_DEPOSIT_SAVE_FAILED,
        response,
      });

      return;
    }

    // error handling for the response if it is a server side error
    if (response.error || response.errors) {
      const errorStatus =
        response.errors?.[0]?.status || response?.status || '';
      const errorCodeOrMessage =
        response.errors?.[0]?.code || response?.error || 'unknown-error';
      const event = {
        endpoint: DIRECT_DEPOSIT_API_ENDPOINT,
        status: API_STATUS.FAILED,
        method: 'PUT',
        extraProperties: {
          'error-key': `${errorCodeOrMessage} ${errorStatus}`,
        },
      };

      client.recordDirectDepositEvent(event);

      captureDirectDepositError(response, {
        eventName: 'put-direct-deposit-failed',
      });

      dispatch({
        type: DIRECT_DEPOSIT_SAVE_FAILED,
        response,
      });

      return;
    }

    //  record the successful ga event and dispatch the success action
    client.recordDirectDepositEvent({
      endpoint: DIRECT_DEPOSIT_API_ENDPOINT,
      status: API_STATUS.SUCCESSFUL,
      method: 'PUT',
    });

    dispatch({ type: DIRECT_DEPOSIT_SAVE_ERROR_CLEARED });

    dispatch({
      type: DIRECT_DEPOSIT_SAVE_SUCCEEDED,
      response,
    });
  };
}

export const toggleDirectDepositEdit = open => ({
  type: DIRECT_DEPOSIT_EDIT_TOGGLED,
  open,
});
