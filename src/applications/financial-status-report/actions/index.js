import { differenceInMilliseconds } from 'date-fns';
import environment from 'platform/utilities/environment';
import localStorage from 'platform/utilities/storage/localStorage';
import {
  fetchAndUpdateSessionExpiration as fetch,
  apiRequest,
} from 'platform/utilities/api';
import * as Sentry from '@sentry/browser';
import {
  FSR_API_ERROR,
  FSR_RESET_ERRORS,
  FSR_API_CALL_INITIATED,
  DEBTS_FETCH_SUCCESS,
  DEBTS_FETCH_FAILURE,
} from '../constants/actionTypes';
import { DEBT_TYPES } from '../constants';

export const fetchFormStatus = () => async dispatch => {
  dispatch({
    type: FSR_API_CALL_INITIATED,
  });

  const sessionExpiration = new Date(localStorage.getItem('sessionExpiration'));
  const remainingSessionTime = differenceInMilliseconds(
    sessionExpiration,
    new Date(),
  );

  if (!remainingSessionTime) {
    // reset errors if user is not logged in or session has expired
    return dispatch({
      type: FSR_RESET_ERRORS,
    });
  }

  try {
    fetch(`${environment.API_URL}/v0/in_progress_forms/5655`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
        'Source-App-Name': window.appName,
      },
    })
      .then(response => response.json())
      .then(response => {
        if (response.errors) {
          dispatch({
            type: FSR_API_ERROR,
            error: response,
          });
        }
      });
  } catch (error) {
    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage(`FSR fetchFormStatus failed: ${error.detail}`);
    });
  }
  return dispatch({
    type: FSR_RESET_ERRORS,
  });
};

export const fetchDebts = async dispatch => {
  const getDebts = () => {
    const options = {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
        'Source-App-Name': window.appName,
      },
    };

    return apiRequest(`${environment.API_URL}/v0/debts`, options);
  };

  try {
    const response = await getDebts();

    const filteredResponse = response.debts.map((debt, index) => ({
      ...debt,
      id: index,
      debtType: DEBT_TYPES.DEBT,
    }));

    return dispatch({
      type: DEBTS_FETCH_SUCCESS,
      debts: filteredResponse,
    });
  } catch (error) {
    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage(`FSR fetchDebts failed: ${error.detail}`);
    });
    dispatch({
      type: DEBTS_FETCH_FAILURE,
      error,
    });
    throw new Error(error);
  }
};
