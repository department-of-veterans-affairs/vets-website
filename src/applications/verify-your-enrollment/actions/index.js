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
export const UPDATE_ADDRESS = 'UPDATE_ADDRESS';
export const UPDATE_ADDRESS_SUCCESS = 'UPDATE_ADDRESS_SUCCESS';
export const UPDATE_ADDRESS_FAILURE = 'UPDATE_ADDRESS_FAILURE';
export const UPDATE_BANK_INFO = 'UPDATE_BANK_INFO';
export const UPDATE_BANK_INFO_SUCCESS = 'UPDATE_BANK_INFO_SUCCESS';
export const UPDATE_BANK_INFO_FAILED = 'UPDATE_BANK_INFO_FAILED';
export const VERIFY_ENROLLMENT = 'VERIFY_ENROLLMENT';
export const VERIFY_ENROLLMENT_SUCCESS = 'VERIFY_ENROLLMENT_SUCCESS';
export const VERIFY_ENROLLMENT_FAILURE = 'VERIFY_ENROLLMENT_FAILURE';
export const TOGGLE_ENROLLMENT_ERROR_STATEMENT =
  'TOGGLE_ENROLLMENT_ERROR_STATEMENT';
export const UPDATE_TOGGLE_ENROLLMENT_SUCCESS =
  'UPDATE_TOGGLE_ENROLLMENT_SUCCESS';
export const UPDATE_TOGGLE_ENROLLMENT_ERROR = 'UPDATE_TOGGLE_ENROLLMENT_ERROR';

export const updateToggleEnrollmentSuccess = toggleEnrollmentSuccess => ({
  type: UPDATE_TOGGLE_ENROLLMENT_SUCCESS,
  payload: toggleEnrollmentSuccess,
});

export const updateToggleEnrollmentError = toggleEnrollmentError => ({
  type: UPDATE_TOGGLE_ENROLLMENT_ERROR,
  payload: toggleEnrollmentError,
});

export const updateToggleEnrollmentCard = toggleEnrollmentErrorStatement => ({
  type: TOGGLE_ENROLLMENT_ERROR_STATEMENT,
  payload: toggleEnrollmentErrorStatement,
});

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
    return apiRequest(API_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
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

export function postMailingAddress(mailingAddress) {
  return async dispatch => {
    dispatch({ type: UPDATE_ADDRESS });
    try {
      const response = await apiRequest(`${API_URL}/address`, {
        method: 'POST',
        body: JSON.stringify(mailingAddress),
        headers: { 'Content-Type': 'application/json' },
      });
      dispatch({
        type: UPDATE_ADDRESS_SUCCESS,
        response,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_ADDRESS_FAILURE,
        errors: error,
      });
      throw error;
    }
  };
}

export const updateBankInfo = bankInfo => {
  return async dispatch => {
    dispatch({ type: UPDATE_BANK_INFO });
    try {
      const response = await apiRequest(`${API_URL}/bank_info`, {
        method: 'POST',
        body: JSON.stringify(bankInfo),
        headers: { 'Content-Type': 'application/json' },
      });

      dispatch({
        type: UPDATE_BANK_INFO_SUCCESS,
        response,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_BANK_INFO_FAILED,
        errors: error,
      });
      throw error;
    }
  };
};

export const verifyEnrollmentAction = () => {
  return async dispatch => {
    dispatch({ type: VERIFY_ENROLLMENT });
    try {
      const response = await apiRequest(`${API_URL}/verify`, {
        method: 'POST',
        // body: JSON.stringify(bankInfo),
        headers: { 'Content-Type': 'application/json' },
      });

      dispatch({
        type: VERIFY_ENROLLMENT_SUCCESS,
        response,
      });
    } catch (error) {
      dispatch({
        type: VERIFY_ENROLLMENT_FAILURE,
        errors: error,
      });
      throw error;
    }
  };
};
