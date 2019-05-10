import { apiRequest } from 'platform/utilities/api';
import { getData } from './index';

export const PAYMENT_INFORMATION_FETCH_SUCCEEDED =
  'FETCH_PAYMENT_INFORMATION_SUCCESS';

export const PAYMENT_INFO_UI_STATE_CHANGED = 'PAYMENT_INFO_UI_STATE_CHANGED';

export const PAYMENT_INFORMATION_EDIT_MODAL_TOGGLED =
  'PAYMENT_INFORMATION_EDIT_MODAL_TOGGLED';
export const PAYMENT_INFORMATION_EDIT_MODAL_FIELD_CHANGED =
  'PAYMENT_INFORMATION_FORM_FIELD_CHANGED';

export const PAYMENT_INFORMATION_SAVE_STARTED =
  'PAYMENT_INFORMATION_SAVE_STARTED';
export const PAYMENT_INFORMATION_SAVE_SUCCEEDED =
  'PAYMENT_INFORMATION_SAVE_SUCCEEDED';
export const PAYMENT_INFORMATION_SAVE_FAILED =
  'PAYMENT_INFORMATION_SAVE_FAILED';

export function fetchPaymentInformation() {
  return async dispatch => {
    dispatch({
      type: PAYMENT_INFORMATION_FETCH_SUCCEEDED,
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
      dispatch({ type: PAYMENT_INFORMATION_SAVE_STARTED });

      const response = await apiRequest(
        '/ppiu/payment_information',
        apiRequestOptions,
      );

      dispatch({
        type: PAYMENT_INFORMATION_SAVE_SUCCEEDED,
        paymentInformation: response.data.attributes,
      });
    } catch (response) {
      dispatch({
        type: PAYMENT_INFORMATION_SAVE_FAILED,
        response,
      });
    }
  };
}

export function setPaymentInformationUiState(state) {
  return {
    type: PAYMENT_INFO_UI_STATE_CHANGED,
    state,
  };
}

export function editModalToggled() {
  return { type: PAYMENT_INFORMATION_EDIT_MODAL_TOGGLED };
}

export function editModalFieldChanged(fieldName, fieldValue) {
  return {
    type: PAYMENT_INFORMATION_EDIT_MODAL_FIELD_CHANGED,
    fieldName,
    fieldValue,
  };
}
