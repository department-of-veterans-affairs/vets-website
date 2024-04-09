import { captureError } from '@@vap-svc/util/analytics';

import { getData } from '~/platform/user/profile/utilities';

import { API_STATUS } from '../constants';
import { recordApiEvent } from '../util';

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
  recordApiEvent,
};

// action creator to fetch direct deposit information
export function fetchDirectDeposit({
  captureError: captureDirectDepositError,
  recordApiEvent: recordDirectDepositEvent,
} = fetchDirectDepositArgs) {
  return async dispatch => {
    dispatch({ type: DIRECT_DEPOSIT_FETCH_STARTED });
    dispatch({ type: DIRECT_DEPOSIT_LOAD_ERROR_CLEARED });
    dispatch({ type: DIRECT_DEPOSIT_SAVE_ERROR_CLEARED });

    recordDirectDepositEvent({
      endpoint: DIRECT_DEPOSIT_API_ENDPOINT,
      status: API_STATUS.STARTED,
    });

    const response = await getData(DIRECT_DEPOSIT_API_ENDPOINT);

    if (response.error || response.errors) {
      recordDirectDepositEvent({
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
      recordDirectDepositEvent({
        endpoint: DIRECT_DEPOSIT_API_ENDPOINT,
        status: API_STATUS.SUCCESSFUL,
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
    recordApiEvent: recordDirectDepositEvent,
  } = fetchDirectDepositArgs,
) {
  return async dispatch => {
    dispatch({ type: DIRECT_DEPOSIT_SAVE_STARTED });

    recordDirectDepositEvent({
      endpoint: DIRECT_DEPOSIT_API_ENDPOINT,
      status: API_STATUS.STARTED,
    });

    const response = await getData(DIRECT_DEPOSIT_API_ENDPOINT, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    // error handling for the response
    if (response.error || response.errors) {
      recordDirectDepositEvent({
        endpoint: DIRECT_DEPOSIT_API_ENDPOINT,
        status: API_STATUS.FAILED,
      });

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
    recordDirectDepositEvent({
      endpoint: DIRECT_DEPOSIT_API_ENDPOINT,
      status: API_STATUS.SUCCESSFUL,
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

export const clearDirectDepositLoadError = () => ({
  type: DIRECT_DEPOSIT_LOAD_ERROR_CLEARED,
});
