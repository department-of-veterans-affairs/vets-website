import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { USER_MOCK_DATA } from '../constants/mockData';
// Action Types
export const UPDATE_PENDING_VERIFICATIONS = 'UPDATE_PENDING_VERIFICATIONS';
export const UPDATE_VERIFICATIONS = 'UPDATE_VERIFICATIONS';
export const GET_DATA = 'GET_DATA';
export const GET_DATA_SUCCESS = 'GET_DATA_SUCCESS';
export const FETCH_PERSONAL_INFO = 'FETCH_PERSONAL_INFO';
export const FETCH_PERSONAL_INFO_SUCCESS = 'FETCH_PERSONAL_INFO_SUCCESS';
export const FETCH_PERSONAL_INFO_FAILED = 'FETCH_PERSONAL_INFO_FAILED';
export const UPDATE_BANK_INFO = 'UPDATE_BANK_INFO';
export const UPDATE_BANK_INFO_SUCCESS = 'UPDATE_BANK_INFO_SUCCESS';
export const UPDATE_BANK_INFO_FAILED = 'UPDATE_BANK_INFO_FAILED';

const API_URL = `${environment.API_URL}/vye/v1`;

// Action Creators
export const updatePendingVerifications = pendingVerifications => ({
  type: UPDATE_PENDING_VERIFICATIONS,
  payload: pendingVerifications,
});

export const updateVerifications = verifications => ({
  type: UPDATE_VERIFICATIONS,
  payload: verifications,
});

export const getData = () => {
  return disptach => {
    disptach({ type: GET_DATA }); // TODO: replace with real API call when is ready
    setTimeout(() => {
      disptach({
        type: GET_DATA_SUCCESS,
        response: USER_MOCK_DATA,
      });
    }, 1000);
  };
};
export const fetchPersonalInfo = () => {
  return async dispatch => {
    dispatch({ type: FETCH_PERSONAL_INFO });
    return apiRequest(API_URL)
      .then(response => {
        dispatch({
          type: FETCH_PERSONAL_INFO_SUCCESS,
          response,
        });
      })
      .catch(errors => {
        dispatch({
          type: FETCH_PERSONAL_INFO_FAILED,
          errors,
        });
      });
  };
};

export const updateBankInfo = bankInfo => {
  return async dispatch => {
    dispatch({ type: UPDATE_BANK_INFO });
    return apiRequest(`${API_URL}/bank_info`, {
      method: 'POST',
      body: JSON.stringify(bankInfo),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => {
        // eslint-disable-next-line no-console
        console.log(response);
        dispatch({
          type: UPDATE_BANK_INFO_SUCCESS,
          response,
        });
      })
      .catch(errors => {
        dispatch({
          type: UPDATE_BANK_INFO_FAILED,
          errors,
        });
      });
  };
};
