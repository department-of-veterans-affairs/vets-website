import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { removeCommas, splitAddressLine } from '../helpers';
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

export const ADDRESS_VALIDATION_START = 'ADDRESS_VALIDATION_START';
export const ADDRESS_VALIDATION_SUCCESS = 'ADDRESS_VALIDATION_SUCCESS';
export const ADDRESS_VALIDATION_FAIL = 'ADDRESS_VALIDATION_FAIL';
export const SET_SUGGESTED_ADDRESS_PICKED = 'SET_SUGGESTED_ADDRESS_PICKED';

export const handleSuggestedAddressPicked = value => ({
  type: SET_SUGGESTED_ADDRESS_PICKED,
  payload: value,
});

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
const customHeaders = {
  'Content-Type': 'application/json',
  'X-Key-Inflection': 'camel',
};
export function postMailingAddress(mailingAddress) {
  return async dispatch => {
    dispatch({ type: UPDATE_ADDRESS });
    try {
      const response = await apiRequest(`${API_URL}/address`, {
        method: 'POST',
        body: JSON.stringify(mailingAddress),
        headers: customHeaders,
      });
      dispatch({
        type: UPDATE_ADDRESS_SUCCESS,
        response,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_ADDRESS_FAILURE,
        errors: error.toString(),
      });
      throw new Error('something went wrong');
    }
  };
}

export const updateBankInfo = bankInfo => {
  return async dispatch => {
    dispatch({ type: UPDATE_BANK_INFO });
    try {
      const processedBankInfo = removeCommas(bankInfo);
      const response = await apiRequest(`${API_URL}/bank_info`, {
        method: 'POST',
        body: JSON.stringify(processedBankInfo),
        headers: customHeaders,
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

export const verifyEnrollmentAction = verifications => {
  return async dispatch => {
    dispatch({ type: VERIFY_ENROLLMENT });
    try {
      const response = await apiRequest(`${API_URL}/verify`, {
        method: 'POST',
        body: JSON.stringify({ awardIds: verifications }),
        headers: customHeaders,
      });

      dispatch({
        type: VERIFY_ENROLLMENT_SUCCESS,
        response,
      });
    } catch (error) {
      dispatch({
        type: VERIFY_ENROLLMENT_FAILURE,
        errors: error.toString(),
      });
    }
  };
};

export const validateAddress = (formData, fullName) => async (
  dispatch,
  getState,
) => {
  dispatch({ type: ADDRESS_VALIDATION_START });
  try {
    const validationResponse = await apiRequest('/profile/address_validation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const {
      address,
      addressMetaData: { confidenceScore, addressType },
    } = validationResponse.addresses[0];
    const {
      suggestedAddress: { isSuggestedAddressPicked },
    } = getState();

    let stateAndZip = {};
    if (address.countryCodeIso3 === 'USA') {
      stateAndZip = {
        state: address.stateCode,
        zipCode: address.zipCode,
      };
    } else {
      stateAndZip = {
        state: address.province,
        zipCode: address.internationalPostalCode,
      };
    }
    if (
      confidenceScore === 100 ||
      isSuggestedAddressPicked ||
      (addressType === 'International' && confidenceScore >= 96)
    ) {
      const updatedAddress = splitAddressLine(address.addressLine1, 20);
      const fields = {
        veteranName: fullName,
        address1: updatedAddress.line1,
        address2: updatedAddress.line2,
        address3: address.addressLine3,
        address4: address.addressLine4,
        city: address.city,
        ...stateAndZip,
      };
      try {
        dispatch(postMailingAddress(removeCommas(fields)));
        dispatch({
          type: ADDRESS_VALIDATION_SUCCESS,
          payload: validationResponse,
        });
      } catch (error) {
        await dispatch({ type: 'RESET_ADDRESS_VALIDATIONS' });
        throw new Error(error);
      }
    } else {
      dispatch({
        type: ADDRESS_VALIDATION_SUCCESS,
        payload: validationResponse,
      });
    }
  } catch (error) {
    dispatch({
      type: ADDRESS_VALIDATION_FAIL,
      payload: error.toString(),
    });
  }
};
