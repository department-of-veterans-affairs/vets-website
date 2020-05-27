import { isVet360Configured } from 'platform/user/profile/vet360/util/local-vet360';
import { fetchAndUpdateSessionExpiration as fetch } from 'platform/utilities/api';
import { debtLettersSuccess } from '../utils/mockResponses';
import environment from 'platform/utilities/environment';

export const DEBTS_FETCH_INITIATED = 'DEBTS_FETCH_INITIATED';
export const DEBTS_FETCH_SUCCESS = 'DEBTS_FETCH_SUCCESS';
export const DEBTS_FETCH_FAILURE = 'DEBTS_FETCH_FAILURE';

const fetchDebtLettersSuccess = debts => ({
  type: DEBTS_FETCH_SUCCESS,
  debts,
});

const fetchDebtLettersFailure = () => ({ type: DEBTS_FETCH_FAILURE });

const fetchDebtLettersInitiated = () => ({ type: DEBTS_FETCH_INITIATED });

export const fetchDebtLetters = () => async dispatch => {
  dispatch(fetchDebtLettersInitiated());
  try {
    const response = isVet360Configured()
      ? await fetch(`${environment.API_URL}/v0/debts`)
      : await debtLettersSuccess();
    dispatch(fetchDebtLettersSuccess(response.data));
  } catch (error) {
    dispatch(fetchDebtLettersFailure());
  }
};
