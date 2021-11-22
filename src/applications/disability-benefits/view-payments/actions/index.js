import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from 'platform/utilities/api';
import { isServerError, isClientError } from '../utils';

export const PAYMENTS_RECEIVED_STARTED = 'PAYMENTS_RECEIVED_STARTED';
export const PAYMENTS_RECEIVED_SUCCEEDED = 'PAYMENTS_RECEIVED_SUCCEEDED';
export const PAYMENTS_RECEIVED_FAILED = 'PAYMENTS_RECEIVED_FAILED';

const VIEW_PAYMENTS_URI = '/profile/payment_history';

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
    const error = response.errors[0];
    if (isServerError(error.status)) {
      recordEvent({
        event: `view-payment-history-failed`,
        'error-key': `${error.status}_server_error`,
      });
    } else if (isClientError(error.status)) {
      recordEvent({
        event: `view-payment-history-failed`,
        'error-key': `${error.status}_client_error`,
      });
    }
    dispatch({ type: PAYMENTS_RECEIVED_FAILED, response: error });
  } else {
    recordEvent({
      event: `view-payment-history-successful`,
    });
    dispatch({ type: PAYMENTS_RECEIVED_SUCCEEDED, response });
  }
};
