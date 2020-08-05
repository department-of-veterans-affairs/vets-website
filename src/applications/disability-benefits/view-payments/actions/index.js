import recordEvent from 'platform/monitoring/record-event';
// import { isServerError, isClientError } from '../config/utilities';
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
    // TODO: fire off analytics event when endpoint is wired up.
    //   const errCode = res.errors[0].code;
    //   isServerError(errCode) ? recordEvent({}) : recordEvent({})
    recordEvent({
      event: `disability-view-dependents-load-failed`,
      'error-key': `${response.errors[0].status}_description_of_error`,
    });
    dispatch({ type: PAYMENTS_RECEIVED_FAILED, response });
  } else {
    recordEvent({
      event: `view-payment-history-successful`,
    });
    dispatch({ type: PAYMENTS_RECEIVED_SUCCEEDED, response });
  }
};
