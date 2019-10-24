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
const GA_ERROR_KEY_DEFAULT = 'other-error';

export async function getData(apiRoute, options) {
  try {
    const response = await apiRequest(apiRoute, options);
    return response.data.attributes;
  } catch (error) {
    return { error };
  }
}

function hasErrorMessage(errors, errorKey, errorText) {
  if (errorText) {
    return errors.some(err =>
      err.meta.messages.some(
        message =>
          message.key === errorKey &&
          message.text.toLowerCase().includes(errorText.toLowerCase()),
      ),
    );
  }
  return errors.some(err =>
    err.meta.messages.some(message => message.key === errorKey),
  );
}

export function hasFlaggedForFraudError(errors) {
  return (
    hasErrorMessage(errors, ACCOUNT_FLAGGED_FOR_FRAUD_KEY) ||
    hasErrorMessage(errors, PAYMENT_RESTRICTIONS_PRESENT_KEY) ||
    hasErrorMessage(errors, ROUTING_NUMBER_FLAGGED_FOR_FRAUD_KEY)
  );
}

export function hasInvalidRoutingNumberError(errors) {
  let result = false;
  if (hasErrorMessage(errors, INVALID_ROUTING_NUMBER_KEY)) {
    result = true;
  }
  if (hasErrorMessage(errors, GENERIC_ERROR_KEY, 'Invalid Routing Number')) {
    result = true;
  }
  return result;
}

export function hasInvalidAddressError(errors) {
  let result = false;
  if (hasErrorMessage(errors, GENERIC_ERROR_KEY, 'address update')) {
    result = true;
  }
  return result;
}

export function hasInvalidHomePhoneNumberError(errors) {
  let result = false;
  if (
    hasErrorMessage(errors, GENERIC_ERROR_KEY, 'night phone number') ||
    hasErrorMessage(errors, GENERIC_ERROR_KEY, 'night area number')
  ) {
    result = true;
  }
  return result;
}

export function hasInvalidWorkPhoneNumberError(errors) {
  let result = false;
  if (
    hasErrorMessage(errors, GENERIC_ERROR_KEY, 'day phone number') ||
    hasErrorMessage(errors, GENERIC_ERROR_KEY, 'day area number')
  ) {
    result = true;
  }
  return result;
}

// Helper that creates and returns an object to pass to the recordEvent()
// function when an errors occurs while trying to save/update a user's direct
// deposit payment information. The value of the `error-key` prop will change
// depending on the content of the `errors` array.
export function createDirectDepositAnalyticsDataObject(errors) {
  const key = 'error-key';
  const eventDataObject = {
    event: 'profile-edit-failure',
    'profile-action': 'save-failure',
    'profile-section': 'direct-deposit-information',
    [key]: GA_ERROR_KEY_DEFAULT,
  };
  if (errors && errors.length) {
    if (hasInvalidAddressError(errors)) {
      eventDataObject[key] = GA_ERROR_KEY_BAD_ADDRESS;
    } else if (hasInvalidHomePhoneNumberError(errors)) {
      eventDataObject[key] = GA_ERROR_KEY_BAD_HOME_PHONE;
    } else if (hasInvalidWorkPhoneNumberError(errors)) {
      eventDataObject[key] = GA_ERROR_KEY_BAD_WORK_PHONE;
    }
  }
  return eventDataObject;
}
