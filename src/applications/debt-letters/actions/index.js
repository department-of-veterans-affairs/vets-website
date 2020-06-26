import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import { isVet360Configured } from 'platform/user/profile/vet360/util/local-vet360.js';
import { debtLettersSuccess, debtHistorySuccess } from '../utils/mockResponses';

export const DEBTS_FETCH_INITIATED = 'DEBTS_FETCH_INITIATED';
export const DEBTS_FETCH_SUCCESS = 'DEBTS_FETCH_SUCCESS';
export const DEBTS_FETCH_FAILURE = 'DEBTS_FETCH_FAILURE';
export const DEBTS_SET_ACTIVE_DEBT = 'DEBTS_SET_ACTIVE_DEBT';

const fetchDebtLettersSuccess = debts => ({
  type: DEBTS_FETCH_SUCCESS,
  debts,
});

const fetchDebtLettersFailure = () => ({ type: DEBTS_FETCH_FAILURE });

const fetchDebtLettersInitiated = () => ({ type: DEBTS_FETCH_INITIATED });

export const setActiveDebt = debt => ({
  type: DEBTS_SET_ACTIVE_DEBT,
  debt,
});

export const fetchDebtLetters = () => async dispatch => {
  dispatch(fetchDebtLettersInitiated());
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
    const response = isVet360Configured()
      ? await apiRequest(`${environment.API_URL}/v0/debts`, options)
      : await debtLettersSuccess();

    const responseWithHistory = response.data.map(async debt => {
      const debtHistory = await debtHistorySuccess(debt.adamKey);
      return { ...debt, debtHistory };
    });

    return Promise.all(responseWithHistory).then(res =>
      dispatch(fetchDebtLettersSuccess(res)),
    );
  } catch (error) {
    return dispatch(fetchDebtLettersFailure());
  }
};
