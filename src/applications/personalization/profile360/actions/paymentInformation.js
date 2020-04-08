import { getData, createDirectDepositAnalyticsDataObject } from '../util';
import recordAnalyticsEvent from 'platform/monitoring/record-event';

export const PAYMENT_INFORMATION_FETCH_STARTED =
  'FETCH_PAYMENT_INFORMATION_STARTED';
export const PAYMENT_INFORMATION_FETCH_SUCCEEDED =
  'FETCH_PAYMENT_INFORMATION_SUCCESS';
export const PAYMENT_INFORMATION_FETCH_FAILED =
  'FETCH_PAYMENT_INFORMATION_FAILED';

export const PAYMENT_INFORMATION_EDIT_MODAL_TOGGLED =
  'PAYMENT_INFORMATION_EDIT_MODAL_TOGGLED';

export const PAYMENT_INFORMATION_SAVE_STARTED =
  'PAYMENT_INFORMATION_SAVE_STARTED';
export const PAYMENT_INFORMATION_SAVE_SUCCEEDED =
  'PAYMENT_INFORMATION_SAVE_SUCCEEDED';
export const PAYMENT_INFORMATION_SAVE_FAILED =
  'PAYMENT_INFORMATION_SAVE_FAILED';

export function fetchPaymentInformation(recordEvent = recordAnalyticsEvent) {
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

export function savePaymentInformation(
  fields,
  isEnrollingInDirectDeposit = false,
  recordEvent = recordAnalyticsEvent,
) {
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

    // Leaving this here for the time being while we wrap up the error handling
    // const response = {
    //   error: {
    //     errors: [
    //       {
    //         title: 'Unprocessable Entity',
    //         detail: 'One or more unprocessable user payment properties',
    //         code: '126',
    //         source: 'EVSS::PPIU::Service',
    //         status: '422',
    //         meta: {
    //           messages: [
    //             {
    //               key: 'cnp.payment.generic.error.message',
    //               severity: 'ERROR',
    //               text:
    //                 'Generic CnP payment update error. Update response: Update Failed: Night area number is invalid, must be 3 digits',
    //             },
    //           ],
    //         },
    //       },
    //     ],
    //   },
    // };

    if (response.error || response.errors) {
      const errors = response?.error?.errors || [];
      const analyticsData = createDirectDepositAnalyticsDataObject(
        errors,
        isEnrollingInDirectDeposit,
      );
      recordEvent(analyticsData);
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
