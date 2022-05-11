import moment from 'moment';
import { isVAProfileServiceConfigured } from '@@vap-svc/util/local-vapsvc';
import environment from 'platform/utilities/environment';
import localStorage from 'platform/utilities/storage/localStorage';
import {
  fetchAndUpdateSessionExpiration as fetch,
  apiRequest,
} from 'platform/utilities/api';
import * as Sentry from '@sentry/browser';
import { deductionCodes } from '../../debt-letters/const/deduction-codes';
import { DEBTS_FETCH_SUCCESS } from '../../debt-letters/actions';
import { debtMockResponse } from '../../debt-letters/utils/mockResponses';
import {
  FSR_API_ERROR,
  FSR_RESET_ERRORS,
  FSR_API_CALL_INITIATED,
} from '../constants/actionTypes';

export const fetchFormStatus = () => async dispatch => {
  dispatch({
    type: FSR_API_CALL_INITIATED,
  });
  const sessionExpiration = localStorage.getItem('sessionExpiration');
  const remainingSessionTime = moment(sessionExpiration).diff(moment());

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
      Sentry.captureMessage(`FSR fetchDebts failed: ${error.detail}`);
    });
  }
  return dispatch({
    type: FSR_RESET_ERRORS,
  });
};

export const fetchDebts = () => async (dispatch, getState) => {
  const state = getState();
  const { currentlyLoggedIn } = state.user.login;
  const fetchApiData = currentlyLoggedIn && isVAProfileServiceConfigured();

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

    return fetchApiData
      ? apiRequest(`${environment.API_URL}/v0/debts`, options)
      : debtMockResponse();
  };

  try {
    const response = await getDebts();
    const approvedDeductionCodes = Object.keys(deductionCodes);
    // filter approved deductionCodes &&
    // remove debts that have a current amount owed of 0
    const filteredResponse = response.debts
      .filter(debt => approvedDeductionCodes.includes(debt.deductionCode))
      .filter(debt => debt.currentAr > 0)
      .map((debt, index) => ({ ...debt, id: index }));

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
      type: FSR_API_ERROR,
      error,
    });
    throw new Error(error);
  }
};
