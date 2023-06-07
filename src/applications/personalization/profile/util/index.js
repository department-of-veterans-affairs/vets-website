import { FIELD_NAMES } from '@@vap-svc/constants';
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
export const LighthouseErrorKeys = {
  LH_RATE_LIMIT_ERROR_KEY: 'cnp.payment.api.rate.limit.exceeded',
  LH_ACCOUNT_FLAGGED_FOR_FRAUD_KEY: 'cnp.payment.accounting.number.fraud',
  LH_ACCOUNT_NUMBER_INVALID_KEY: 'cnp.payment.account.number.invalid',
  LH_ACCOUNT_TYPE_INVALID_KEY: 'cnp.payment.account.type.invalid',
  LH_PAYMENT_RESTRICTIONS_PRESENT_KEY:
    'cnp.payment.restriction.indicators.present',
  LH_ROUTING_NUMBER_INVALID_KEY: 'cnp.payment.routing.number.invalid',
  LH_ROUTING_NUMBER_FLAGGED_FOR_FRAUD_KEY: 'cnp.payment.routing.number.fraud',
  LH_ROUTING_NUMBER_INVALID_CHECKSUM_KEY:
    'cnp.payment.routing.number.invalid.checksum',
  LH_UNSPECIFIED_ERROR_KEY: 'cnp.payment.unspecified.error',
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
  hasErrorMessage(errors, LighthouseErrorKeys.LH_ACCOUNT_FLAGGED_FOR_FRAUD_KEY);

export const hasRoutingNumberFlaggedError = errors =>
  hasErrorMessage(errors, ROUTING_NUMBER_FLAGGED_FOR_FRAUD_KEY) ||
  hasErrorMessage(
    errors,
    LighthouseErrorKeys.LH_ROUTING_NUMBER_FLAGGED_FOR_FRAUD_KEY,
  );

export const hasInvalidRoutingNumberError = errors =>
  hasErrorMessage(errors, INVALID_ROUTING_NUMBER_KEY) ||
  hasErrorMessage(errors, LighthouseErrorKeys.LH_ROUTING_NUMBER_INVALID_KEY) ||
  hasErrorMessage(
    errors,
    LighthouseErrorKeys.LH_ROUTING_NUMBER_INVALID_CHECKSUM_KEY,
  ) ||
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
    LighthouseErrorKeys.LH_PAYMENT_RESTRICTIONS_PRESENT_KEY,
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

// Helper that creates and returns an object to pass to the recordEvent()
// function when an error occurs while trying to save/update a user's direct
// deposit for compensation and pension payment information. The value of the
// `error-key` prop will change depending on the content of the `errors` array.
export const createCNPDirectDepositAnalyticsDataObject = (
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
    'profile-section': `cnp-direct-deposit-information`,
    [key]: errorCode,
  };
};

// checks for basic field data or data for nested object like gender identity
export const isFieldEmpty = (data, fieldName) => {
  // checks whether data is available and in the case of gender identity if there is a code present
  return (
    !data ||
    (fieldName === FIELD_NAMES.GENDER_IDENTITY && !data?.[fieldName]?.code)
  );
};
