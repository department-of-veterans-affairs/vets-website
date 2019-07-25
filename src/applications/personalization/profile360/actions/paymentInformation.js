import { getData } from '../util';
import recordEvent from 'platform/monitoring/record-event';

export const PAYMENT_INFORMATION_FETCH_STARTED =
  'FETCH_PAYMENT_INFORMATION_STARTED';
export const PAYMENT_INFORMATION_FETCH_SUCCEEDED =
  'FETCH_PAYMENT_INFORMATION_SUCCESS';
export const PAYMENT_INFORMATION_FETCH_FAILED =
  'FETCH_PAYMENT_INFORMATION_FAILED';

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
    dispatch({ type: PAYMENT_INFORMATION_FETCH_STARTED });

    const response = await getData('/ppiu/payment_information');

    if (response.error) {
      recordEvent({ event: 'profile-get-direct-deposit-failure' });
      dispatch({
        type: PAYMENT_INFORMATION_FETCH_FAILED,
        response,
      });
    } else {
      recordEvent({ event: 'profile-get-direct-deposit-retrieved' });
      dispatch({
        type: PAYMENT_INFORMATION_FETCH_SUCCEEDED,
        response,
      });
    }
  };
}

export function savePaymentInformation(fields) {
  return async dispatch => {
    let gaClientId;
    try {
      // eslint-disable-next-line no-undef
      gaClientId = ga.getAll()[0].get('clientId');
    } catch (e) {
      // don't want to break submitting because of a weird GA issue
    }
    const apiRequestOptions = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...fields,
        gaClientId,
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
      recordEvent({
        event: 'profile-edit-failure',
        'profile-action': 'save-failure',
        'profile-section': 'direct-deposit-information',
      });
      dispatch({
        type: PAYMENT_INFORMATION_SAVE_FAILED,
        response,
      });
    } else {
      recordEvent({
        event: 'profile-transaction',
        'profile-section': 'direct-deposit-information',
      });
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
