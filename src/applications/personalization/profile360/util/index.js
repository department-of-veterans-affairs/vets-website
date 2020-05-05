import { apiRequest } from 'platform/utilities/api';

// possible values for the `key` property on error messages we get from the server
const ACCOUNT_FLAGGED_FOR_FRAUD_KEY = 'cnp.payment.flashes.on.record.message';
const GENERIC_ERROR_KEY = 'cnp.payment.generic.error.message';
const INVALID_ROUTING_NUMBER_KEY =
  'payment.accountRoutingNumber.invalidCheckSum';
const PAYMENT_RESTRICTIONS_PRESENT_KEY =
  'payment.restriction.indicators.present';
const ROUTING_NUMBER_FLAGGED_FOR_FRAUD_KEY =
  'cnp.payment.routing.number.fraud.message';

const GA_ERROR_KEY_BAD_ADDRESS = 'mailing-address-error';
const GA_ERROR_KEY_BAD_HOME_PHONE = 'home-phone-error';
const GA_ERROR_KEY_BAD_WORK_PHONE = 'work-phone-error';
const GA_ERROR_KEY_ACCOUNT_FLAGGED_FOR_FRAUD =
  'account-flagged-for-fraud-error';
const GA_ERROR_KEY_ROUTING_NUMBER_FLAGGED_FOR_FRAUD =
  'routing-number-flagged-for-fraud-error';
const GA_ERROR_KEY_INVALID_ROUTING_NUMBER = 'invalid-routing-number-error';
const GA_ERROR_KEY_PAYMENT_RESTRICTIONS =
  'payment-restriction-indicators-error';
const GA_ERROR_KEY_DEFAULT = 'other-error';

export async function getData(apiRoute, options) {
  try {
    const response = await apiRequest(apiRoute, options);
    return response.data.attributes;
  } catch (error) {
    return { error };
  }
}

const hasErrorMessage = (errors, errorKey, errorText) => {
  if (errorText) {
    return errors.some(err =>
      err.meta?.messages?.some(
        message =>
          message.key === errorKey &&
          message.text?.toLowerCase().includes(errorText.toLowerCase()),
      ),
    );
  }
  return errors.some(err =>
    err.meta?.messages?.some(message => message.key === errorKey),
  );
};

export const hasAccountFlaggedError = errors =>
  hasErrorMessage(errors, ACCOUNT_FLAGGED_FOR_FRAUD_KEY);

export const hasRoutingNumberFlaggedError = errors =>
  hasErrorMessage(errors, ROUTING_NUMBER_FLAGGED_FOR_FRAUD_KEY);

export const hasInvalidRoutingNumberError = errors =>
  hasErrorMessage(errors, INVALID_ROUTING_NUMBER_KEY) ||
  hasErrorMessage(errors, GENERIC_ERROR_KEY, 'Invalid Routing Number');

export const hasInvalidAddressError = errors =>
  hasErrorMessage(errors, GENERIC_ERROR_KEY, 'address update');

export const hasInvalidHomePhoneNumberError = errors =>
  hasErrorMessage(errors, GENERIC_ERROR_KEY, 'night phone number') ||
  hasErrorMessage(errors, GENERIC_ERROR_KEY, 'night area number');

export const hasInvalidWorkPhoneNumberError = errors =>
  hasErrorMessage(errors, GENERIC_ERROR_KEY, 'day phone number') ||
  hasErrorMessage(errors, GENERIC_ERROR_KEY, 'day area number');

export const hasPaymentRestrictionIndicatorsError = errors =>
  hasErrorMessage(errors, PAYMENT_RESTRICTIONS_PRESENT_KEY);

// Helper that creates and returns an object to pass to the recordEvent()
// function when an error occurs while trying to save/update a user's direct
// deposit payment information. The value of the `error-key` prop will change
// depending on the content of the `errors` array.
export const createDirectDepositAnalyticsDataObject = (
  errors = [],
  isEnrolling = false,
) => {
  const key = 'error-key';
  let errorCode = GA_ERROR_KEY_DEFAULT;
  if (hasAccountFlaggedError(errors)) {
    errorCode = GA_ERROR_KEY_ACCOUNT_FLAGGED_FOR_FRAUD;
  } else if (hasRoutingNumberFlaggedError(errors)) {
    errorCode = GA_ERROR_KEY_ROUTING_NUMBER_FLAGGED_FOR_FRAUD;
  } else if (hasInvalidRoutingNumberError(errors)) {
    errorCode = GA_ERROR_KEY_INVALID_ROUTING_NUMBER;
  } else if (hasInvalidAddressError(errors)) {
    errorCode = GA_ERROR_KEY_BAD_ADDRESS;
  } else if (hasInvalidHomePhoneNumberError(errors)) {
    errorCode = GA_ERROR_KEY_BAD_HOME_PHONE;
  } else if (hasInvalidWorkPhoneNumberError(errors)) {
    errorCode = GA_ERROR_KEY_BAD_WORK_PHONE;
  } else if (hasPaymentRestrictionIndicatorsError(errors)) {
    errorCode = GA_ERROR_KEY_PAYMENT_RESTRICTIONS;
  }
  // append to the end of the errorCode
  errorCode = `${errorCode}${isEnrolling ? '-enroll' : '-update'}`;
  return {
    event: 'profile-edit-failure',
    'profile-action': 'save-failure',
    'profile-section': 'direct-deposit-information',
    [key]: errorCode,
  };
};
