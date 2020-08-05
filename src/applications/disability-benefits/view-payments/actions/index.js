import recordEvent from 'platform/monitoring/record-event';
import { isServerError, isClientError } from '../utils';
// import { getData, isServerError, isClientError } from '../util';

export const PAYMENTS_RECEIVED_SUCCEEDED = 'PAYMENTS_RECEIVED_SUCCEEDED';
export const PAYMENTS_RECEIVED_FAILED = 'PAYMENTS_RECEIVED_FAILED';

function resolveAfter2Seconds() {
  return new Promise(resolve => {
    setTimeout(() => {
      recordEvent({
        event: `view-payment-history-started`,
      });
      resolve('resolved');
    }, 2000);
  });
}

export const getAllPayments = () => async dispatch => {
  const response = await resolveAfter2Seconds();
  if (response.errors) {
    if (isServerError(response.errors[0].status)) {
      recordEvent({
        event: `disability-view-dependents-load-failed`,
        'error-key': `${response.errors[0].status}_503_server_error`,
      });
    } else if (isClientError(response.errors)) {
      recordEvent({
        event: `disability-view-dependents-load-failed`,
        'error-key': `${response.errors[0].status}_404_client_error`,
      });
    }
    dispatch({ type: PAYMENTS_RECEIVED_FAILED, response });
  } else {
    recordEvent({
      event: `view-payment-history-successful`,
    });
    dispatch({ type: PAYMENTS_RECEIVED_SUCCEEDED, response });
  }
};
