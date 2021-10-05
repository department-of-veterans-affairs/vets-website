import environment from '~/platform/utilities/environment';
import recordEvent from '~/platform/monitoring/record-event';
import { apiRequest } from '~/platform/utilities/api';
import { deductionCodes } from '../const/deduction-codes';

export const DEBTS_FETCH_INIT = 'DEBTS_FETCH_INIT';
export const DEBTS_FETCH_SUCCESS = 'DEBTS_FETCH_SUCCESS';
export const DEBTS_FETCH_FAILURE = 'DEBTS_FETCH_FAILURE';
export const DEBT_LETTERS_FETCH_INIT = 'DEBT_LETTERS_FETCH_INIT';
export const DEBT_LETTERS_FETCH_SUCCESS = 'DEBT_LETTERS_FETCH_SUCCESS';
export const DEBT_LETTERS_FETCH_FAILURE = 'DEBT_LETTERS_FETCH_FAILURE';
export const DEBTS_SET_ACTIVE_DEBT = 'DEBTS_SET_ACTIVE_DEBT';

export const setActiveDebt = debt => ({
  type: DEBTS_SET_ACTIVE_DEBT,
  debt,
});

export const fetchDebtLetters = () => async dispatch => {
  dispatch({
    type: DEBT_LETTERS_FETCH_INIT,
  });
  try {
    const response = await apiRequest(`${environment.API_URL}/v0/debt_letters`);

    // Remove DMC prefixing added by VBMS
    const filteredResponse = response.map(debtLetter => {
      if (debtLetter.typeDescription.includes('DMC - ')) {
        return {
          ...debtLetter,
          typeDescription: debtLetter.typeDescription.slice(6),
          date: new Date(debtLetter.receivedAt),
        };
      }
      return debtLetter;
    });

    return dispatch({
      type: DEBT_LETTERS_FETCH_SUCCESS,
      debtLinks: filteredResponse,
    });
  } catch (error) {
    recordEvent({ event: 'bam-get-veteran-vbms-info-failed' });
    return dispatch({
      type: DEBT_LETTERS_FETCH_FAILURE,
    });
  }
};

export const fetchDebts = () => async dispatch => {
  dispatch({ type: DEBTS_FETCH_INIT });
  try {
    const response = await apiRequest(`${environment.API_URL}/v0/debtz`);

    const { hasDependentDebts } = response;
    const approvedDeductionCodes = Object.keys(deductionCodes);
    // remove any debts that do not have approved deductionCodes or
    // that have a current amount owed of 0
    const filteredResponse = response.debts
      .filter(res => approvedDeductionCodes.includes(res.deductionCode))
      .filter(debt => debt.currentAr > 0);

    recordEvent({
      event: 'bam-get-veteran-dmc-info-successful',
      'veteran-has-dependent-debt': hasDependentDebts,
    });

    if (filteredResponse.length > 0) {
      recordEvent({
        event: 'bam-cards-retrieved',
        'number-of-current-debt-cards': filteredResponse.length,
      });
    }

    // if a veteran has dependent debt do NOT fetch debt letters
    if (!hasDependentDebts) {
      dispatch(fetchDebtLetters());
    }

    return dispatch({
      type: DEBTS_FETCH_SUCCESS,
      debts: filteredResponse,
      hasDependentDebts,
    });
  } catch (error) {
    recordEvent({ event: 'bam-get-veteran-dmc-info-failed' });
    return dispatch({
      type: DEBTS_FETCH_FAILURE,
      errors: error.errors,
    });
  }
};
