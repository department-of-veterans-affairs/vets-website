import { getData } from '../util';

export const PAYMENT_INFORMATION_FETCH_SUCCEEDED =
  'FETCH_PAYMENT_INFORMATION_SUCCESS';

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
      response: await getData('/ppiu/payment_information'),
    });
  };
}

export function savePaymentInformation(fields) {
  return async dispatch => {
    const apiRequestOptions = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...fields,
        // eslint-disable-next-line no-undef
        gaClientId: ga.getAll()[0].get('clientId'),
      }),
      method: 'PUT',
      mode: 'cors',
    };

    dispatch({ type: PAYMENT_INFORMATION_SAVE_STARTED });

    const response = await getData(
      '/ppiu/payment_information',
      apiRequestOptions,
    );

    if (response.error) {
      dispatch({
        type: PAYMENT_INFORMATION_SAVE_FAILED,
        response,
      });
    } else {
      dispatch({
        type: PAYMENT_INFORMATION_SAVE_SUCCEEDED,
        response,
      });
    }
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
