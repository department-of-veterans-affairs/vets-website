import { apiRequest } from '~/platform/utilities/api';
import environment from '~/platform/utilities/environment';
import { deductionCodes } from '~/applications/debt-letters/const/deduction-codes';
import {
  DEBTS_FETCH_SUCCESS,
  DEBTS_FETCH_FAILURE,
} from '~/applications/debt-letters/actions';
import { FSR_API_ERROR } from '~/applications/financial-status-report/constants/actionTypes';

export const fetchDebts = () => async dispatch => {
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
    if (response.errors) {
      return dispatch({
        type: DEBTS_FETCH_FAILURE,
        error: response,
      });
    }
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
    dispatch({
      type: FSR_API_ERROR,
      error,
    });
    throw new Error(error);
  }
};
