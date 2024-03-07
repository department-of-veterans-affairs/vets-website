import cloneDeep from 'lodash/cloneDeep';
import { apiRequest } from '~/platform/utilities/api';

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

export async function getData(apiRoute, options) {
  try {
    const response = await apiRequest(apiRoute, options);
    return response.data.attributes;
  } catch (error) {
    return { error };
  }
}

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
    return hasLighthouseErrorText(errors, errorKey, errorText);
  }
  return hasLighthouseErrorKey(errors, errorKey);
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
    errorKeys: [LIGHTHOUSE_ERROR_KEYS.ACCOUNT_FLAGGED_FOR_FRAUD],
  });

export const hasRoutingNumberFlaggedError = errors =>
  hasErrorCombos({
    errors,
    errorKeys: [LIGHTHOUSE_ERROR_KEYS.ROUTING_NUMBER_FLAGGED_FOR_FRAUD],
  });

export const hasInvalidRoutingNumberError = errors =>
  hasErrorCombos({
    errors,
    errorKeys: [
      LIGHTHOUSE_ERROR_KEYS.ROUTING_NUMBER_INVALID_CHECKSUM,
      LIGHTHOUSE_ERROR_KEYS.ROUTING_NUMBER_INVALID,
    ],
  }) ||
  hasErrorCombos({
    errors,
    errorKeys: [
      LIGHTHOUSE_ERROR_KEYS.UNSPECIFIED_ERROR,
      LIGHTHOUSE_ERROR_KEYS.GENERIC_ERROR,
    ],
    errorTexts: ['Invalid Routing Number'],
  });

export const hasInvalidAddressError = errors =>
  hasErrorCombos({
    errors,
    errorKeys: [
      LIGHTHOUSE_ERROR_KEYS.UNSPECIFIED_ERROR,
      LIGHTHOUSE_ERROR_KEYS.GENERIC_ERROR,
    ],
    errorTexts: ['address update'],
  }) || hasErrorMessage(errors, LIGHTHOUSE_ERROR_KEYS.MAILING_ADDRESS_INVALID);

export const hasInvalidHomePhoneNumberError = errors =>
  hasErrorCombos({
    errors,
    errorKeys: [
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
    errorKeys: [LIGHTHOUSE_ERROR_KEYS.PAYMENT_RESTRICTIONS_PRESENT],
  });

export const cnpDirectDepositBankInfo = apiData => {
  return apiData?.paymentAccount;
};

export const eduDirectDepositAccountNumber = apiData => {
  return apiData?.accountNumber;
};

export const isEligibleForCNPDirectDeposit = apiData => {
  const controlInfo = apiData?.controlInformation;
  return !!controlInfo?.canUpdateDirectDeposit;
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

// Helper that creates and returns an object to pass to the recordEvent()
// function when an error occurs while trying to save/update a user's direct
// deposit for compensation and pension payment information. The value of the
// `error-key` prop will change depending on the content of the `errors` array.
export const createCNPDirectDepositAnalyticsDataObject = ({
  errors = [],
  isEnrolling = false,
} = {}) => {
  const errorCode = getLighthouseErrorCode(errors);

  return cloneDeep({
    event: 'profile-edit-failure',
    'profile-action': 'save-failure',
    'profile-section': `cnp-direct-deposit-information`,
    'error-key': `${errorCode}${isEnrolling ? '-enroll' : '-update'}`,
  });
};
