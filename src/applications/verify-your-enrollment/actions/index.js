import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  isVerificationEndDateValid,
  removeCommas,
  splitAddressLine,
} from '../helpers';
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
export const CHECK_CLAIMANT_START = 'CHECK_CLAIMANT_START';
export const CHECK_CLAIMANT_SUCCESS = 'CHECK_CLAIMANT_SUCCESS';
export const CHECK_CLAIMANT_FAIL = 'CHECK_CLAIMANT_FAIL';
export const CHECK_CLAIMANT_END = 'CHECK_CLAIMANT_END';
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

// Action constants

/**
 * doDGIBCall
 * Helper that performs:
 *  1) GET /dgib_verifications/claimant_lookup to get claimantId
 *  2) POST /dgib_verifications/verification_record with that claimantId
 * Then dispatches FETCH_PERSONAL_INFO_SUCCESS upon success.
 */
async function doDGIBCall(dispatch) {
  const claimantRes = await apiRequest(
    `${API_URL}/dgib_verifications/claimant_lookup`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const verificationRecordRes = await apiRequest(
    `${API_URL}/dgib_verifications/verification_record`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ claimantId: claimantRes.claimantId }),
    },
  );

  // Dispatch success with both results
  dispatch({
    type: FETCH_PERSONAL_INFO_SUCCESS,
    response: {
      claimantLookup: claimantRes,
      verificationRecord: verificationRecordRes,
    },
  });
}
/**
 * fetchPersonalInfo
 * 1) It tries apiRequest(API_URL, ...) first.
 *    - If it returns a valid response (not 204), dispatch success with that data.
 *    - If it returns status 204 or throws an error, we fall back to two doDGIBCall calls:
 *      a) GET /dgib_verifications/claimant_lookup
 *      b) POST /dgib_verifications/verification_record (using the claimantId )
 */
export const fetchPersonalInfo = () => {
  return async dispatch => {
    dispatch({ type: FETCH_PERSONAL_INFO });

    try {
      // 1) First, call the main API
      const mainResponse = await apiRequest(API_URL, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (mainResponse && mainResponse.status !== 204) {
        dispatch({
          type: FETCH_PERSONAL_INFO_SUCCESS,
          response: mainResponse,
        });
      } else {
        // when the status is 204 (no content) do fallback calls
        await doDGIBCall(dispatch);
      }
    } catch (error) {
      // If there's an error in the first call, do the  doDGIBCall fallback
      try {
        await doDGIBCall(dispatch);
      } catch (fallbackError) {
        dispatch({
          type: FETCH_PERSONAL_INFO_FAILED,
          errors: fallbackError,
        });
      }
    }
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
  return async (dispatch, getState) => {
    dispatch({ type: VERIFY_ENROLLMENT });
    const { personalInfo } = getState();
    const claimantId = personalInfo?.personalInfo?.claimantLookup?.claimantId;
    const enrollmentVerifications =
      personalInfo?.personalInfo?.verificationRecord?.enrollmentVerifications ||
      [];
    const URL = claimantId
      ? `${API_URL}/dgib_verifications/verify_claimant`
      : `${API_URL}/verify`;
    const newVerifications = enrollmentVerifications?.filter(
      verification =>
        !verification?.verificationMethod &&
        isVerificationEndDateValid(verification?.verificationEndDate),
    );
    const lastVerification =
      newVerifications?.length > 0
        ? newVerifications[newVerifications?.length - 1]
        : null;
    const body = claimantId
      ? (() => {
          return {
            claimantId,
            verifiedPeriodBeginDate: lastVerification?.verificationBeginDate,
            verifiedPeriodEndDate: lastVerification?.verificationEndDate,
            verifiedThroughDate: lastVerification?.verificationEndDate,
            verificationMethod: 'VYE',
            appCommunication: {
              responseType: 'Y',
            },
          };
        })()
      : { awardIds: verifications };
    try {
      const response = await apiRequest(URL, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: customHeaders,
      });

      dispatch({
        type: VERIFY_ENROLLMENT_SUCCESS,
        response,
      });
      dispatch(fetchPersonalInfo());
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
