import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from 'platform/utilities/api';
import { isServerError, isClientError } from '../utils/helpers';

export const PAYMENTS_RECEIVED_STARTED = 'PAYMENTS_RECEIVED_STARTED';
export const PAYMENTS_RECEIVED_SUCCEEDED = 'PAYMENTS_RECEIVED_SUCCEEDED';
export const PAYMENTS_RECEIVED_FAILED = 'PAYMENTS_RECEIVED_FAILED';

const VIEW_PAYMENTS_URI = '/profile/payment_history';

const retrievePayments = async () => {
  try {
    const response = await apiRequest(VIEW_PAYMENTS_URI);
    if (response.errors) {
      return response;
    }
    return response.data.attributes;
  } catch (error) {
    return { errors: [error] };
  }
};

export const getAllPayments = () => async dispatch => {
  dispatch({ type: PAYMENTS_RECEIVED_STARTED });
  const response = await retrievePayments();
  if (response.errors) {
    const error = response.errors[0];
    if (isServerError(error.status)) {
      recordEvent({
        event: `api_call`,
        'error-key': `${error.status} server error`,
        'api-name': 'GET payment history',
        'api-status': 'failed',
      });
    } else if (isClientError(error.status)) {
      recordEvent({
        event: `api_call`,
        'error-key': `${error.status} client error`,
        'api-name': 'GET payment history',
        'api-status': 'failed',
      });
    }
    dispatch({ type: PAYMENTS_RECEIVED_FAILED, error });
  } else {
    recordEvent({
      event: `api_call`,
      'api-name': 'GET payment history',
      'api-status': 'successful',
    });
    dispatch({
      type: PAYMENTS_RECEIVED_SUCCEEDED,
      payments: response.payments,
    });
  }
};
