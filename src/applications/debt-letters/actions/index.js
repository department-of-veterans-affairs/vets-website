import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import { isVet360Configured } from 'platform/user/profile/vet360/util/local-vet360.js';
import {
  debtLettersSuccess,
  debtLettersSuccessVBMS,
} from '../utils/mockResponses';
import { deductionCodes } from '../const';

export const DEBTS_FETCH_INITIATED = 'DEBTS_FETCH_INITIATED';
export const DEBTS_FETCH_SUCCESS = 'DEBTS_FETCH_SUCCESS';
export const DEBTS_FETCH_FAILURE = 'DEBTS_FETCH_FAILURE';
export const DEBTS_SET_ACTIVE_DEBT = 'DEBTS_SET_ACTIVE_DEBT';
export const DEBT_LETTERS_FETCH_INITIATED = 'DEBT_LETTERS_FETCH_INITIATED';
export const DEBT_LETTERS_FETCH_SUCCESS = 'DEBT_LETTERS_FETCH_SUCCESS';
export const DEBT_LETTERS_FETCH_FAILURE = 'DEBT_LETTERS_FETCH_FAILURE';

const fetchDebtLettersSuccess = debts => ({
  type: DEBTS_FETCH_SUCCESS,
  debts,
});

const fetchDebtLettersVBMSSuccess = debtLinks => ({
  type: DEBT_LETTERS_FETCH_SUCCESS,
  debtLinks,
});

const fetchDebtLettersFailure = () => ({ type: DEBTS_FETCH_FAILURE });
const fetchDebtLettersVBMSFailure = () => ({
  type: DEBT_LETTERS_FETCH_FAILURE,
});

const fetchDebtsInitiated = () => ({ type: DEBTS_FETCH_INITIATED });
const fetchDebtLettersInitiated = () => ({
  type: DEBT_LETTERS_FETCH_INITIATED,
});

export const setActiveDebt = debt => ({
  type: DEBTS_SET_ACTIVE_DEBT,
  debt,
});

export const fetchDebtLetters = () => async dispatch => {
  dispatch(fetchDebtsInitiated());
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

    if (Object.keys(response).includes('error')) {
      return dispatch(fetchDebtLettersFailure());
    }

    const approvedDeductionCodes = Object.keys(deductionCodes);
    const filteredResponse = response.filter(res =>
      approvedDeductionCodes.includes(res.deductionCode),
    );
    return dispatch(fetchDebtLettersSuccess(filteredResponse));
  } catch (error) {
    return dispatch(fetchDebtLettersFailure());
  }
};

export const fetchDebtLettersVBMS = () => async dispatch => {
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
      ? await apiRequest(`${environment.API_URL}/v0/debt_letters`, options)
      : await debtLettersSuccessVBMS();

    // Remove DMC  -  prefixing added by VBMS
    const filteredResponse = response.map(debtLetter => {
      if (debtLetter.typeDescription.includes('DMC - ')) {
        return {
          ...debtLetter,
          typeDescription: debtLetter.typeDescription.slice(6),
        };
      }
      return debtLetter;
    });

    return dispatch(fetchDebtLettersVBMSSuccess(filteredResponse));
  } catch (error) {
    return dispatch(fetchDebtLettersVBMSFailure());
  }
};
