import {
  createCNPDirectDepositAnalyticsDataObject,
  getData,
  isEligibleForCNPDirectDeposit,
  isSignedUpForCNPDirectDeposit,
  isSignedUpForEDUDirectDeposit,
} from '../util';
import recordAnalyticsEvent from 'platform/monitoring/record-event';

export const CNP_PAYMENT_INFORMATION_FETCH_STARTED =
  'CNP_PAYMENT_INFORMATION_FETCH_STARTED';
export const CNP_PAYMENT_INFORMATION_FETCH_SUCCEEDED =
  'CNP_PAYMENT_INFORMATION_FETCH_SUCCEEDED';
export const CNP_PAYMENT_INFORMATION_FETCH_FAILED =
  'CNP_PAYMENT_INFORMATION_FETCH_FAILED';

export const CNP_PAYMENT_INFORMATION_EDIT_TOGGLED =
  'CNP_PAYMENT_INFORMATION_EDIT_TOGGLED';

export const CNP_PAYMENT_INFORMATION_SAVE_STARTED =
  'CNP_PAYMENT_INFORMATION_SAVE_STARTED';
export const CNP_PAYMENT_INFORMATION_SAVE_SUCCEEDED =
  'CNP_PAYMENT_INFORMATION_SAVE_SUCCEEDED';
export const CNP_PAYMENT_INFORMATION_SAVE_FAILED =
  'CNP_PAYMENT_INFORMATION_SAVE_FAILED';

export const EDU_PAYMENT_INFORMATION_FETCH_STARTED =
  'EDU_PAYMENT_INFORMATION_FETCH_STARTED';
export const EDU_PAYMENT_INFORMATION_FETCH_SUCCEEDED =
  'EDU_PAYMENT_INFORMATION_FETCH_SUCCEEDED';
export const EDU_PAYMENT_INFORMATION_FETCH_FAILED =
  'EDU_PAYMENT_INFORMATION_FETCH_FAILED';

export const EDU_PAYMENT_INFORMATION_EDIT_TOGGLED =
  'EDU_PAYMENT_INFORMATION_EDIT_TOGGLED';

export const EDU_PAYMENT_INFORMATION_SAVE_STARTED =
  'EDU_PAYMENT_INFORMATION_SAVE_STARTED';
export const EDU_PAYMENT_INFORMATION_SAVE_SUCCEEDED =
  'EDU_PAYMENT_INFORMATION_SAVE_SUCCEEDED';
export const EDU_PAYMENT_INFORMATION_SAVE_FAILED =
  'EDU_PAYMENT_INFORMATION_SAVE_FAILED';

export function fetchCNPPaymentInformation(recordEvent = recordAnalyticsEvent) {
  return async dispatch => {
    dispatch({ type: CNP_PAYMENT_INFORMATION_FETCH_STARTED });

    recordEvent({ event: `profile-get-cnp-direct-deposit-started` });
    const response = await getData('/ppiu/payment_information');

    // sample error when getting payment information
    // response = {
    //   errors: [
    //     {
    //       title: 'Bad Gateway',
    //       detail: 'Received an an invalid response from the upstream server',
    //       code: 'EVSS502',
    //       source: 'EVSS::PPIU::Service',
    //       status: '502',
    //     },
    //   ],
    // };

    if (response.error) {
      recordEvent({ event: `profile-get-cnp-direct-deposit-failed` });
      dispatch({
        type: CNP_PAYMENT_INFORMATION_FETCH_FAILED,
        response,
      });
    } else {
      recordEvent({
        event: `profile-get-cnp-direct-deposit-retrieved`,
        // The API might report an empty payment address for some folks who are
        // already enrolled in direct deposit. But we want to make sure we
        // always treat those who are signed up as being eligible. Therefore
        // we'll check to see if they either have a payment address _or_ are
        // already signed up for direct deposit here:
        'direct-deposit-setup-eligible':
          isEligibleForCNPDirectDeposit(response) ||
          isSignedUpForCNPDirectDeposit(response),
        'direct-deposit-setup-complete': isSignedUpForCNPDirectDeposit(
          response,
        ),
      });
      dispatch({
        type: CNP_PAYMENT_INFORMATION_FETCH_SUCCEEDED,
        response,
      });
    }
  };
}

export function saveCNPPaymentInformation(
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

    dispatch({ type: CNP_PAYMENT_INFORMATION_SAVE_STARTED });

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
      const analyticsData = createCNPDirectDepositAnalyticsDataObject(
        errors,
        isEnrollingInDirectDeposit,
      );
      recordEvent(analyticsData);
      dispatch({
        type: CNP_PAYMENT_INFORMATION_SAVE_FAILED,
        response,
      });
    } else {
      recordEvent({
        event: 'profile-transaction',
        'profile-section': `cnp-direct-deposit-information`,
      });
      dispatch({
        type: CNP_PAYMENT_INFORMATION_SAVE_SUCCEEDED,
        response,
      });
    }
  };
}

export function editCNPPaymentInformationToggled() {
  return { type: CNP_PAYMENT_INFORMATION_EDIT_TOGGLED };
}

export function fetchEDUPaymentInformation(recordEvent = recordAnalyticsEvent) {
  return async dispatch => {
    dispatch({ type: EDU_PAYMENT_INFORMATION_FETCH_STARTED });

    recordEvent({ event: 'profile-get-edu-direct-deposit-started' });
    const response = await getData('/profile/ch33_bank_accounts');

    if (response.error) {
      recordEvent({ event: 'profile-get-edu-direct-deposit-failed' });
      dispatch({
        type: EDU_PAYMENT_INFORMATION_FETCH_FAILED,
        response,
      });
    } else {
      recordEvent({
        event: 'profile-get-edu-direct-deposit-retrieved',
        // NOTE: the GET profile/ch33_bank_accounts/ is not able to tell us if a
        // user is eligible to set up DD for EDU, so we are only reporting if
        // they are currently enrolled in DD for EDU or not
        'direct-deposit-setup-complete': isSignedUpForEDUDirectDeposit(
          response,
        ),
      });
      dispatch({
        type: EDU_PAYMENT_INFORMATION_FETCH_SUCCEEDED,
        response: {
          paymentAccount: response,
        },
      });
    }
  };
}

export function saveEDUPaymentInformation(
  fields,
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

    dispatch({ type: EDU_PAYMENT_INFORMATION_SAVE_STARTED });

    const response = await getData(
      '/profile/ch33_bank_accounts',
      apiRequestOptions,
    );

    if (response.error || response.errors) {
      recordEvent({
        event: 'profile-edit-failure',
        'profile-action': 'save-failure',
        'profile-section': 'edu-direct-deposit-information',
      });
      dispatch({
        type: EDU_PAYMENT_INFORMATION_SAVE_FAILED,
        response,
      });
    } else {
      recordEvent({
        event: 'profile-transaction',
        'profile-section': 'edu-direct-deposit-information',
      });
      dispatch({
        type: EDU_PAYMENT_INFORMATION_SAVE_SUCCEEDED,
        response: {
          paymentAccount: response,
        },
      });
    }
  };
}

export function editEDUPaymentInformationToggled() {
  return { type: EDU_PAYMENT_INFORMATION_EDIT_TOGGLED };
}
