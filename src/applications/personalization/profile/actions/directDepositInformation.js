import { captureError } from '@@vap-svc/util/analytics';

import { getData } from '~/platform/user/profile/utilities';

import { API_STATUS } from '../constants';
import { recordApiEvent } from '../util';

// action types for direct deposit information

// fetch actions
export const DIRECT_DEPOSIT_INFORMATION_FETCH_STARTED =
  'DIRECT_DEPOSIT_INFORMATION_FETCH_STARTED';
export const DIRECT_DEPOSIT_INFORMATION_FETCH_SUCCEEDED =
  'DIRECT_DEPOSIT_INFORMATION_FETCH_SUCCEEDED';
export const DIRECT_DEPOSIT_INFORMATION_FETCH_FAILED =
  'DIRECT_DEPOSIT_INFORMATION_FETCH_FAILED';

// save actions
export const DIRECT_DEPOSIT_INFORMATION_SAVE_STARTED =
  'DIRECT_DEPOSIT_INFORMATION_SAVE_STARTED';
export const DIRECT_DEPOSIT_INFORMATION_SAVE_SUCCEEDED =
  'DIRECT_DEPOSIT_INFORMATION_SAVE_SUCCEEDED';
export const DIRECT_DEPOSIT_INFORMATION_SAVE_FAILED =
  'DIRECT_DEPOSIT_INFORMATION_SAVE_FAILED';

// edit actions for ui state
export const DIRECT_DEPOSIT_INFORMATION_EDIT_TOGGLED =
  'DIRECT_DEPOSIT_INFORMATION_EDIT_TOGGLED';

// API endpoint for fetching and updating direct deposit information
const DIRECT_DEPOSIT_INFORMATION_API_ENDPOINT = '/profile/direct_deposits';

// action creator to fetch direct deposit information
export function fetchDirectDepositInformation({
  captureDirectDepositError = captureError,
} = {}) {
  return async dispatch => {
    dispatch({ type: DIRECT_DEPOSIT_INFORMATION_FETCH_STARTED });

    recordApiEvent({
      endpoint: DIRECT_DEPOSIT_INFORMATION_API_ENDPOINT,
      status: API_STATUS.STARTED,
    });

    const response = await getData(DIRECT_DEPOSIT_INFORMATION_API_ENDPOINT);

    if (response.error) {
      recordApiEvent({
        endpoint: DIRECT_DEPOSIT_INFORMATION_API_ENDPOINT,
        status: API_STATUS.FAILED,
      });

      captureDirectDepositError(response, {
        eventName: 'get-direct-deposit-failed',
      });

      dispatch({
        type: DIRECT_DEPOSIT_INFORMATION_FETCH_FAILED,
        response,
      });
    } else {
      recordApiEvent({
        endpoint: DIRECT_DEPOSIT_INFORMATION_API_ENDPOINT,
        status: API_STATUS.SUCCESSFUL,
      });

      dispatch({
        type: DIRECT_DEPOSIT_INFORMATION_FETCH_SUCCEEDED,
        response,
      });
    }
  };
}

export const toggleDirectDepositInformationEdit = open => ({
  type: DIRECT_DEPOSIT_INFORMATION_EDIT_TOGGLED,
  open,
});
