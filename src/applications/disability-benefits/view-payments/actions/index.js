import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from 'platform/utilities/api';
import { isServerError, isClientError } from '../utils';
// import { getData, isServerError, isClientError } from '../util';

export const PAYMENTS_RECEIVED_STARTED = 'PAYMENTS_RECEIVED_STARTED';
export const PAYMENTS_RECEIVED_SUCCEEDED = 'PAYMENTS_RECEIVED_SUCCEEDED';
export const PAYMENTS_RECEIVED_FAILED = 'PAYMENTS_RECEIVED_FAILED';

const VIEW_PAYMENTS_URI = '/profile/payment_history';

// function resolveAfter2Seconds() {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       recordEvent({
//         event: `view-payment-history-started`,
//       });
//       resolve('resolved');
//     }, 2000);
//   });
// }

const retrievePayments = async () => {
  try {
    const response = await apiRequest(VIEW_PAYMENTS_URI);
    return response.data.attributes;
  } catch (error) {
    return error;
  }
};

export const getAllPayments = () => async dispatch => {
  dispatch({ type: PAYMENTS_RECEIVED_STARTED });
  const response = await retrievePayments();
  if (response.errors) {
    if (isServerError(response.errors[0].status)) {
      recordEvent({
        event: `view-payment-history-failed`,
        'error-key': `${response.errors[0].status}_server_error`,
      });
    } else if (isClientError(response.errors)) {
      recordEvent({
        event: `view-payment-history-failed`,
        'error-key': `${response.errors[0].status}_client_error`,
      });
    }
    const error = response?.errors?.[0];
    dispatch({ type: PAYMENTS_RECEIVED_FAILED, response: error });
  } else {
    recordEvent({
      event: `view-payment-history-successful`,
    });
    dispatch({ type: PAYMENTS_RECEIVED_SUCCEEDED, response });
  }
};
