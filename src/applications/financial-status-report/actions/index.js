import environment from 'platform/utilities/environment';
import { isVAProfileServiceConfigured } from '@@vap-svc/util/local-vapsvc';
import moment from 'moment';
import head from 'lodash/head';
import localStorage from 'platform/utilities/storage/localStorage';
import { deductionCodes } from '../../debt-letters/const/deduction-codes';
import { DEBTS_FETCH_SUCCESS } from '../../debt-letters/actions';
import { debtMockResponse } from '../../debt-letters/utils/mockResponses';
import {
  fetchAndUpdateSessionExpiration as fetch,
  apiRequest,
} from 'platform/utilities/api';
import {
  FSR_API_ERROR,
  FSR_RESET_ERRORS,
  FSR_API_CALL_INITIATED,
} from '../constants/actionTypes';

const fetchDebtLettersSuccess = debts => ({
  type: DEBTS_FETCH_SUCCESS,
  debts,
});

const initiateApiCall = () => ({
  type: FSR_API_CALL_INITIATED,
});

const handleError = error => ({
  type: FSR_API_ERROR,
  error,
});

const resetError = () => ({
  type: FSR_RESET_ERRORS,
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

    return dispatch(fetchDebtLettersSuccess(filteredResponse));
  } catch (err) {
    dispatch(handleError('FSR_SERVER_ERROR'));
    throw new Error(err);
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
