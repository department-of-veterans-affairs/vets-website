import {
  fetchAndUpdateSessionExpiration as fetch,
  apiRequest,
} from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import {
  FSR_API_ERROR,
  FSR_RESET_ERRORS,
  FSR_API_CALL_INITIATED,
} from '../constants/actionTypes';
import { isVAProfileServiceConfigured } from '@@vap-svc/util/local-vapsvc';
import moment from 'moment';
import head from 'lodash/head';
import localStorage from 'platform/utilities/storage/localStorage';
import { deductionCodes } from '../../debt-letters/const/deduction-codes';
import { DEBTS_FETCH_SUCCESS } from '../../debt-letters/actions';
import { debtLettersSuccess } from '../../debt-letters/utils/mockResponses';

const handleError = error => ({
  type: FSR_API_ERROR,
  error,
});

const resetError = () => ({
  type: FSR_RESET_ERRORS,
});

const initiateApiCall = () => ({
  type: FSR_API_CALL_INITIATED,
});

export const fetchFormStatus = () => async dispatch => {
  dispatch(initiateApiCall());
  const sessionExpiration = localStorage.getItem('sessionExpiration');
  const remainingSessionTime = moment(sessionExpiration).diff(moment());
  if (!remainingSessionTime) {
    // bail if there isn't a current session
    // the API returns the same response if a user is missing data OR is not logged in
    // so we need a way to differentiate those - a falsey remaining session will
    // always result in that error so we can go ahead and return
    return dispatch(resetError());
  }
  fetch(`${environment.API_URL}/v0/in_progress_forms/5655`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Key-Inflection': 'camel',
      'Source-App-Name': window.appName,
    },
  })
    .then(res => res.json())
    .then(body => {
      if (body.errors) {
        // handle the possibility of multiple errors
        const firstError = head(body.errors);
        if (firstError.code === '500') {
          return dispatch(handleError('FSR_SERVER_ERROR'));
        }
        return dispatch(handleError(firstError.code.toUpperCase()));
      }
      return dispatch(resetError());
    });
  return null;
};

const fetchDebtLettersSuccess = debts => ({
  type: DEBTS_FETCH_SUCCESS,
  debts,
});

export const fetchDebts = () => async (dispatch, getState) => {
  try {
    const options = {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
        'Source-App-Name': window.appName,
      },
    };

    const state = getState();

    const response =
      isVAProfileServiceConfigured() && state.user.login.currentlyLoggedIn
        ? await apiRequest(`${environment.API_URL}/v0/debts`, options)
        : await debtLettersSuccess();

    const approvedDeductionCodes = Object.keys(deductionCodes);
    // remove any debts that do not have approved deductionCodes or
    // that have a current amount owed of 0
    const filteredResponse = response.debts
      .filter(res => approvedDeductionCodes.includes(res.deductionCode))
      .filter(debt => debt.currentAr > 0)
      .map((debt, index) => ({ ...debt, id: index }));
    return dispatch(fetchDebtLettersSuccess(filteredResponse));
  } catch (error) {
    return null;
  }
};

export const downloadPDF = () => {
  const options = {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Key-Inflection': 'camel',
      'Source-App-Name': window.appName,
    },
  };
  return fetch(
    `${environment.API_URL}/v0/financial_status_reports/download_pdf`,
    options,
  ).catch(err => {
    throw new Error(err);
  });
};
