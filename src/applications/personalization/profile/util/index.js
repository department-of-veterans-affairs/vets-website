import { FIELD_NAMES } from '@@vap-svc/constants';
import cloneDeep from 'lodash/cloneDeep';
import { apiRequest } from '~/platform/utilities/api';

export * from './analytics';

// error keys for profile/direct_deposits/disability_compensations endpoint
// easier to export and use than importing one by one constants
export const LIGHTHOUSE_ERROR_KEYS = {
  ACCOUNT_FLAGGED_FOR_FRAUD: 'cnp.payment.account.number.fraud',
  PAYMENT_RESTRICTIONS_PRESENT: 'cnp.payment.restriction.indicators.present',
  ROUTING_NUMBER_FLAGGED_FOR_FRAUD: 'cnp.payment.routing.number.fraud',
  ROUTING_NUMBER_INVALID_CHECKSUM:
    'cnp.payment.routing.number.invalid.checksum',
  ROUTING_NUMBER_INVALID: 'cnp.payment.routing.number.invalid',
  DAY_PHONE_NUMBER_INVALID: 'cnp.payment.day.phone.number.invalid',
  DAY_PHONE_AREA_INVALID: 'cnp.payment.day.area.number.invalid',
  NIGHT_PHONE_NUMBER_INVALID: 'cnp.payment.night.phone.number.invalid',
  NIGHT_PHONE_AREA_INVALID: 'cnp.payment.night.area.number.invalid',
  MAILING_ADDRESS_INVALID: 'cnp.payment.mailing.address.invalid',
  UNSPECIFIED_ERROR: 'cnp.payment.unspecified.error',
  GENERIC_ERROR: 'cnp.payment.generic.error',
};

const OTHER_ERROR_GA_KEY = 'other-error';

// possible values for the `key` property on error messages we get from the server
// these are for the ppiu/payment_information endpoint
// along with the GA event key for the corresponding error
export const PPIU_ERROR_MAP = {
  ACCOUNT_FLAGGED_FOR_FRAUD: {
    RESPONSE_KEY: 'cnp.payment.flashes.on.record.message',
    GA_KEY: 'account-flagged-for-fraud-error',
  },
  GENERIC_ERROR: {
    RESPONSE_KEY: 'cnp.payment.generic.error.message',
    GA_KEY: OTHER_ERROR_GA_KEY,
  },
  INVALID_ROUTING_NUMBER: {
    RESPONSE_KEY: 'payment.accountRoutingNumber.invalidCheckSum',
    GA_KEY: 'invalid-routing-number-error',
  },
  PAYMENT_RESTRICTIONS_PRESENT: {
    RESPONSE_KEY: 'payment.restriction.indicators.present',
    GA_KEY: 'payment-restriction-indicators-error',
  },
  ROUTING_NUMBER_FLAGGED_FOR_FRAUD: {
    RESPONSE_KEY: 'cnp.payment.routing.number.fraud.message',
    GA_KEY: 'routing-number-flagged-for-fraud-error',
  },
  BAD_ADDRESS: {
    GA_KEY: 'mailing-address-error',
  },
  BAD_HOME_PHONE: {
    GA_KEY: 'home-phone-error',
  },
  BAD_WORK_PHONE: {
    GA_KEY: 'work-phone-error',
  },
};

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
  return errors.some(
    err =>
      err?.code === errorKey &&
      err?.detail?.toLowerCase().includes(errorText.toLowerCase()),
  );
};

const hasLighthouseErrorKey = (errors, errorKey) => {
  return errors.some(err => err?.code === errorKey);
};

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

export const hasErrorCombos = ({
  errors,
  errorKeys = [],
  errorTexts = [],
} = {}) => {
  return errorKeys.some(errorKey => {
    if (errorTexts.length > 0) {
      return errorTexts.some(errorText =>
        hasErrorMessage(errors, errorKey, errorText),
      );
    }
    return hasErrorMessage(errors, errorKey);
  });
};

export const hasAccountFlaggedError = errors =>
  hasErrorCombos({
    errors,
    errorKeys: [
      PPIU_ERROR_MAP.ACCOUNT_FLAGGED_FOR_FRAUD.RESPONSE_KEY,
      LIGHTHOUSE_ERROR_KEYS.ACCOUNT_FLAGGED_FOR_FRAUD,
    ],
  });

export const hasRoutingNumberFlaggedError = errors =>
  hasErrorCombos({
    errors,
    errorKeys: [
      PPIU_ERROR_MAP.ROUTING_NUMBER_FLAGGED_FOR_FRAUD.RESPONSE_KEY,
      LIGHTHOUSE_ERROR_KEYS.ROUTING_NUMBER_FLAGGED_FOR_FRAUD,
    ],
  });

export const hasInvalidRoutingNumberError = errors =>
  hasErrorCombos({
    errors,
    errorKeys: [
      PPIU_ERROR_MAP.INVALID_ROUTING_NUMBER.RESPONSE_KEY,
      LIGHTHOUSE_ERROR_KEYS.ROUTING_NUMBER_INVALID_CHECKSUM,
      LIGHTHOUSE_ERROR_KEYS.ROUTING_NUMBER_INVALID,
    ],
  }) ||
  hasErrorCombos({
    errors,
    errorKeys: [
      PPIU_ERROR_MAP.GENERIC_ERROR.RESPONSE_KEY,
      LIGHTHOUSE_ERROR_KEYS.UNSPECIFIED_ERROR,
      LIGHTHOUSE_ERROR_KEYS.GENERIC_ERROR,
    ],
    errorTexts: ['Invalid Routing Number'],
  });

export const hasInvalidAddressError = errors =>
  hasErrorCombos({
    errors,
    errorKeys: [
      PPIU_ERROR_MAP.GENERIC_ERROR.RESPONSE_KEY,
      LIGHTHOUSE_ERROR_KEYS.UNSPECIFIED_ERROR,
      LIGHTHOUSE_ERROR_KEYS.GENERIC_ERROR,
    ],
    errorTexts: ['address update'],
  }) || hasErrorMessage(errors, LIGHTHOUSE_ERROR_KEYS.MAILING_ADDRESS_INVALID);

export const hasInvalidHomePhoneNumberError = errors =>
  hasErrorCombos({
    errors,
    errorKeys: [
      PPIU_ERROR_MAP.GENERIC_ERROR.RESPONSE_KEY,
      LIGHTHOUSE_ERROR_KEYS.UNSPECIFIED_ERROR,
      LIGHTHOUSE_ERROR_KEYS.GENERIC_ERROR,
    ],
    errorTexts: ['night phone number', 'night area number'],
  }) ||
  hasErrorCombos({
    errors,
    errorKeys: [
      LIGHTHOUSE_ERROR_KEYS.NIGHT_PHONE_NUMBER_INVALID,
      LIGHTHOUSE_ERROR_KEYS.NIGHT_PHONE_AREA_INVALID,
    ],
  });

export const hasInvalidWorkPhoneNumberError = errors =>
  hasErrorCombos({
    errors,
    errorKeys: [
      PPIU_ERROR_MAP.GENERIC_ERROR.RESPONSE_KEY,
      LIGHTHOUSE_ERROR_KEYS.UNSPECIFIED_ERROR,
      LIGHTHOUSE_ERROR_KEYS.GENERIC_ERROR,
    ],
    errorTexts: ['day phone number', 'day area number'],
  }) ||
  hasErrorCombos({
    errors,
    errorKeys: [
      LIGHTHOUSE_ERROR_KEYS.DAY_PHONE_NUMBER_INVALID,
      LIGHTHOUSE_ERROR_KEYS.DAY_PHONE_AREA_INVALID,
    ],
  });

export const hasPaymentRestrictionIndicatorsError = errors =>
  hasErrorCombos({
    errors,
    errorKeys: [
      PPIU_ERROR_MAP.PAYMENT_RESTRICTIONS_PRESENT.RESPONSE_KEY,
      LIGHTHOUSE_ERROR_KEYS.PAYMENT_RESTRICTIONS_PRESENT,
    ],
  });

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
  return `${error?.code || OTHER_ERROR_GA_KEY} | ${error?.detail || ''}`;
};

const getPPIUErrorCode = (errors = []) => {
  if (hasAccountFlaggedError(errors)) {
    return PPIU_ERROR_MAP.ACCOUNT_FLAGGED_FOR_FRAUD.GA_KEY;
  }

  if (hasRoutingNumberFlaggedError(errors)) {
    return PPIU_ERROR_MAP.ROUTING_NUMBER_FLAGGED_FOR_FRAUD.GA_KEY;
  }

  if (hasInvalidRoutingNumberError(errors)) {
    return PPIU_ERROR_MAP.INVALID_ROUTING_NUMBER.GA_KEY;
  }

  if (hasInvalidAddressError(errors)) {
    return PPIU_ERROR_MAP.BAD_ADDRESS.GA_KEY;
  }

  if (hasInvalidHomePhoneNumberError(errors)) {
    return PPIU_ERROR_MAP.BAD_HOME_PHONE.GA_KEY;
  }

  if (hasInvalidWorkPhoneNumberError(errors)) {
    return PPIU_ERROR_MAP.BAD_WORK_PHONE.GA_KEY;
  }

  if (hasPaymentRestrictionIndicatorsError(errors)) {
    return PPIU_ERROR_MAP.PAYMENT_RESTRICTIONS_PRESENT.GA_KEY;
  }

  return PPIU_ERROR_MAP.GENERIC_ERROR.GA_KEY;
};

// Helper that creates and returns an object to pass to the recordEvent()
// function when an error occurs while trying to save/update a user's direct
// deposit for compensation and pension payment information. The value of the
// `error-key` prop will change depending on the content of the `errors` array.
export const createCNPDirectDepositAnalyticsDataObject = ({
  errors = [],
  isEnrolling = false,
  useLighthouseDirectDepositEndpoint = true,
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
