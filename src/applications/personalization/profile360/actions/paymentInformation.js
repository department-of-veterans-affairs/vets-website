import { apiRequest } from 'platform/utilities/api';
import { getData } from './index';

export const FETCH_PAYMENT_INFORMATION_SUCCESS =
  'FETCH_PAYMENT_INFORMATION_SUCCESS';

export const SET_PAYMENT_INFO_UI_STATE = 'SET_PAYMENT_INFO_UI_STATE';

export const SAVE_PAYMENT_INFORMATION = 'SAVE_PAYMENT_INFORMATION';
export const SAVE_PAYMENT_INFORMATION_SUCCESS =
  'SAVE_PAYMENT_INFORMATION_SUCCESS';
export const SAVE_PAYMENT_INFORMATION_FAIL = 'SAVE_PAYMENT_INFORMATION_FAIL';

export function fetchPaymentInformation() {
  return async dispatch => {
    dispatch({
      type: FETCH_PAYMENT_INFORMATION_SUCCESS,
      paymentInformation: await getData('/ppiu/payment_information'),
    });
  };
}

export function savePaymentInformation(fields) {
  return async dispatch => {
    const apiRequestOptions = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
      method: 'PUT',
      mode: 'cors',
    };

    try {
      dispatch({ type: SAVE_PAYMENT_INFORMATION });

      const response = await apiRequest(
        '/ppiu/payment_information',
        apiRequestOptions,
      );

      dispatch({
        type: SAVE_PAYMENT_INFORMATION_SUCCESS,
        paymentInformation: response.data.attributes,
      });
    } catch (response) {
      dispatch({
        type: SAVE_PAYMENT_INFORMATION_FAIL,
        response,
      });
    }
  };
}

export function setPaymentInformationStatus(status) {
  return {
    type: SET_PAYMENT_INFO_UI_STATE,
    status,
  };
}
