import { FIELD_NAMES } from '@@vap-svc/constants';
import cloneDeep from 'lodash/cloneDeep';
import { apiRequest } from '~/platform/utilities/api';

export * from './analytics';

// possible values for the `key` property on error messages we get from the server
// these are for the ppiu/payment_information endpoint
const ACCOUNT_FLAGGED_FOR_FRAUD_KEY = 'cnp.payment.flashes.on.record.message';
const GENERIC_ERROR_KEY = 'cnp.payment.generic.error.message';
const INVALID_ROUTING_NUMBER_KEY =
  'payment.accountRoutingNumber.invalidCheckSum';
const PAYMENT_RESTRICTIONS_PRESENT_KEY =
  'payment.restriction.indicators.present';
const ROUTING_NUMBER_FLAGGED_FOR_FRAUD_KEY =
  'cnp.payment.routing.number.fraud.message';

// error keys for profile/direct_deposits/disability_compensations endpoint
// easier to export and use than importing one by one constants
export const LIGHTHOUSE_ERROR_KEYS = {
  ACCOUNT_FLAGGED_FOR_FRAUD: 'cnp.payment.accounting.number.fraud',
  PAYMENT_RESTRICTIONS_PRESENT: 'cnp.payment.restriction.indicators.present',
  ROUTING_NUMBER_FLAGGED_FOR_FRAUD: 'cnp.payment.routing.number.fraud',
  ROUTING_NUMBER_INVALID: 'cnp.payment.routing.number.invalid.checksum',
  UNSPECIFIED_ERROR: 'cnp.payment.unspecified.error',
};

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

// used for legacy, remove once moved to lighthouse endpoint
const hasPPIUErrorText = (errors, errorKey, errorText) => {
  return errors.some(err =>
    err.meta?.messages?.some(
      message =>
        message.key === errorKey &&
        message.text?.toLowerCase().includes(errorText.toLowerCase()),
    ),
  );
};

// used for legacy, remove once moved to lighthouse endpoint
const hasPPIUErrorKey = (errors, errorKey) => {
  return errors.some(err =>
    err.meta?.messages?.some(message => message.key === errorKey),
  );
};

const hasLighthouseErrorText = (errors, errorKey, errorText) => {
  errors.some(
    err =>
      err?.code === errorKey &&
      err?.detail?.toLowerCase().includes(errorText.toLowerCase()),
  );
};

const hasLighthouseErrorKey = (errors, errorKey) =>
  errors.some(err => err?.code === errorKey);

const hasErrorMessage = (errors, errorKey, errorText) => {
  if (errorText) {
    return (
      hasPPIUErrorText(errors, errorKey, errorText) ||
      hasLighthouseErrorText(errors, errorKey, errorText)
    );
  }
  return (
    hasPPIUErrorKey(errors, errorKey) || hasLighthouseErrorKey(errors, errorKey)
  );
};

export const hasAccountFlaggedError = errors =>
  hasErrorMessage(errors, ACCOUNT_FLAGGED_FOR_FRAUD_KEY) ||
  hasErrorMessage(
    errors,
    LIGHTHOUSE_ERROR_KEYS.LH_ACCOUNT_FLAGGED_FOR_FRAUD_KEY,
  );

export const hasRoutingNumberFlaggedError = errors =>
  hasErrorMessage(errors, ROUTING_NUMBER_FLAGGED_FOR_FRAUD_KEY) ||
  hasErrorMessage(
    errors,
    LIGHTHOUSE_ERROR_KEYS.ROUTING_NUMBER_FLAGGED_FOR_FRAUD,
  );

export const hasInvalidRoutingNumberError = errors =>
  hasErrorMessage(errors, INVALID_ROUTING_NUMBER_KEY) ||
  hasErrorMessage(errors, LIGHTHOUSE_ERROR_KEYS.ROUTING_NUMBER_INVALID) ||
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
  hasErrorMessage(errors, PAYMENT_RESTRICTIONS_PRESENT_KEY) ||
  hasErrorMessage(
    errors,
    LIGHTHOUSE_ERROR_KEYS.LH_PAYMENT_RESTRICTIONS_PRESENT_KEY,
  );

export const cnpDirectDepositBankInfo = apiData => {
  return apiData?.paymentAccount;
};

export const eduDirectDepositAccountNumber = apiData => {
  return apiData?.accountNumber;
};

const cnpDirectDepositAddressInfo = apiData => {
  return apiData?.paymentAddress;
};

export const isEligibleForCNPDirectDeposit = apiData => {
  const addressData = cnpDirectDepositAddressInfo(apiData) ?? {};
  return !!(
    addressData.addressOne &&
    addressData.city &&
    addressData.stateCode
  );
};

export const isSignedUpForCNPDirectDeposit = apiData =>
  !!cnpDirectDepositBankInfo(apiData)?.accountNumber;

export const isSignedUpForEDUDirectDeposit = apiData =>
  !!eduDirectDepositAccountNumber(apiData);

const getLighthouseErrorCode = (errors = []) => {
  // there should only be one error code in the errors array, but just in case
  const error = errors.find(err => err?.code);
  return `${error?.code || GA_ERROR_KEY_DEFAULT} ${error?.detail || ''}`;
};

const getPPIUErrorCode = (errors = []) => {
  if (hasAccountFlaggedError(errors)) {
    return GA_ERROR_KEY_ACCOUNT_FLAGGED_FOR_FRAUD;
  }

  if (hasRoutingNumberFlaggedError(errors)) {
    return GA_ERROR_KEY_ROUTING_NUMBER_FLAGGED_FOR_FRAUD;
  }

  if (hasInvalidRoutingNumberError(errors)) {
    return GA_ERROR_KEY_INVALID_ROUTING_NUMBER;
  }

  if (hasInvalidAddressError(errors)) {
    return GA_ERROR_KEY_BAD_ADDRESS;
  }

  if (hasInvalidHomePhoneNumberError(errors)) {
    return GA_ERROR_KEY_BAD_HOME_PHONE;
  }

  if (hasInvalidWorkPhoneNumberError(errors)) {
    return GA_ERROR_KEY_BAD_WORK_PHONE;
  }

  if (hasPaymentRestrictionIndicatorsError(errors)) {
    return GA_ERROR_KEY_PAYMENT_RESTRICTIONS;
  }

  return GA_ERROR_KEY_DEFAULT;
};

// Helper that creates and returns an object to pass to the recordEvent()
// function when an error occurs while trying to save/update a user's direct
// deposit for compensation and pension payment information. The value of the
// `error-key` prop will change depending on the content of the `errors` array.
export const createCNPDirectDepositAnalyticsDataObject = ({
  errors = [],
  isEnrolling = false,
  useLighthouseDirectDepositEndpoint = false,
} = {}) => {
  const errorCode = useLighthouseDirectDepositEndpoint
    ? getLighthouseErrorCode(errors)
    : getPPIUErrorCode(errors);

  return cloneDeep({
    event: 'profile-edit-failure',
    'profile-action': 'save-failure',
    'profile-section': `cnp-direct-deposit-information`,
    'error-key': `${errorCode}${isEnrolling ? '-enroll' : '-update'}`,
  });
};

// checks for basic field data or data for nested object like gender identity
export const isFieldEmpty = (data, fieldName) => {
  // checks whether data is available and in the case of gender identity if there is a code present
  return (
    !data ||
    (fieldName === FIELD_NAMES.GENDER_IDENTITY && !data?.[fieldName]?.code)
  );
};
