import cloneDeep from 'lodash/cloneDeep';
import recordEvent from '~/platform/monitoring/record-event';
import { apiRequest } from '~/platform/utilities/api';
import { capitalize } from 'lodash';
import { oxfordCommaList } from './textUtils';

export const BASE_DIRECT_DEPOSIT_ERROR_KEYS = {
  ACCOUNT_FLAGGED_FOR_FRAUD: '.account.number.fraud',
  PAYMENT_RESTRICTIONS_PRESENT: '.restriction.indicators.present',
  ROUTING_NUMBER_FLAGGED_FOR_FRAUD: '.routing.number.fraud',
  ROUTING_NUMBER_INVALID_CHECKSUM: '.routing.number.invalid.checksum',
  ROUTING_NUMBER_INVALID: '.routing.number.invalid',
  DAY_PHONE_NUMBER_INVALID: '.day.phone.number.invalid',
  DAY_PHONE_AREA_INVALID: '.day.area.number.invalid',
  NIGHT_PHONE_NUMBER_INVALID: '.night.phone.number.invalid',
  NIGHT_PHONE_AREA_INVALID: '.night.area.number.invalid',
  MAILING_ADDRESS_INVALID: '.mailing.address.invalid',
  PAYMENT_ADDRESS_MISSING: '.payment.address.missing',
  UNSPECIFIED_ERROR: '.unspecified.error',
  GENERIC_ERROR: '.generic.error',
};

export const DIRECT_DEPOSIT_ERROR_KEYS = Object.keys(
  BASE_DIRECT_DEPOSIT_ERROR_KEYS,
).reduce((acc, key) => {
  acc[key] = `direct.deposit${BASE_DIRECT_DEPOSIT_ERROR_KEYS[key]}`;
  return acc;
}, {});

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

export const hasAccountFlaggedError = errors => {
  return hasErrorCombos({
    errors,
    errorKeys: [DIRECT_DEPOSIT_ERROR_KEYS.ACCOUNT_FLAGGED_FOR_FRAUD],
  });
};

export const hasRoutingNumberFlaggedError = errors =>
  hasErrorCombos({
    errors,
    errorKeys: [DIRECT_DEPOSIT_ERROR_KEYS.ROUTING_NUMBER_FLAGGED_FOR_FRAUD],
  });

// the cases for invalid routing number include:
// - invalid routing number checksum error code
// - invalid routing number error code
// - unspecified error code with error text 'Invalid Routing Number' in the error detail
// - generic error code with error text 'Invalid Routing Number' in the error detail
export const hasInvalidRoutingNumberError = errors =>
  hasErrorCombos({
    errors,
    errorKeys: [
      DIRECT_DEPOSIT_ERROR_KEYS.ROUTING_NUMBER_INVALID_CHECKSUM,
      DIRECT_DEPOSIT_ERROR_KEYS.ROUTING_NUMBER_INVALID,
    ],
  }) ||
  hasErrorCombos({
    errors,
    errorKeys: [
      DIRECT_DEPOSIT_ERROR_KEYS.UNSPECIFIED_ERROR,
      DIRECT_DEPOSIT_ERROR_KEYS.GENERIC_ERROR,
    ],
    errorTexts: ['Invalid Routing Number'],
  });

// the cases for invalid address include:
// - unspecified error code with error text 'address update' or 'Payment Address Data Not Found' in the error detail
// - generic error code with error text 'address update' or 'Payment Address Data Not Found' in the error detail
// - mailing address invalid error code
// - payment address missing error code
export const hasInvalidAddressError = errors =>
  hasErrorCombos({
    errors,
    errorKeys: [
      DIRECT_DEPOSIT_ERROR_KEYS.UNSPECIFIED_ERROR,
      DIRECT_DEPOSIT_ERROR_KEYS.GENERIC_ERROR,
    ],
    errorTexts: ['address update', 'Payment Address Data Not Found'],
  }) ||
  hasErrorCombos({
    errors,
    errorKeys: [
      DIRECT_DEPOSIT_ERROR_KEYS.MAILING_ADDRESS_INVALID,
      DIRECT_DEPOSIT_ERROR_KEYS.PAYMENT_ADDRESS_MISSING,
    ],
  });

// the cases for invalid phone number include:
// - unspecified error code with error text 'night phone number' or 'night area number' in the error detail
// - generic error code with error text 'night phone number' or 'night area number' in the error detail
// - night phone number invalid error code
// - night area number invalid error code
export const hasInvalidHomePhoneNumberError = errors =>
  hasErrorCombos({
    errors,
    errorKeys: [
      DIRECT_DEPOSIT_ERROR_KEYS.UNSPECIFIED_ERROR,
      DIRECT_DEPOSIT_ERROR_KEYS.GENERIC_ERROR,
    ],
    errorTexts: ['night phone number', 'night area number'],
  }) ||
  hasErrorCombos({
    errors,
    errorKeys: [
      DIRECT_DEPOSIT_ERROR_KEYS.NIGHT_PHONE_NUMBER_INVALID,
      DIRECT_DEPOSIT_ERROR_KEYS.NIGHT_PHONE_AREA_INVALID,
    ],
  });

// the cases for invalid phone number include:
// - unspecified error code with error text 'day phone number' or 'day area number' in the error detail
// - generic error code with error text 'day phone number' or 'day area number' in the error detail
// - day phone number invalid error code
// - day area number invalid error code
export const hasInvalidWorkPhoneNumberError = errors =>
  hasErrorCombos({
    errors,
    errorKeys: [
      DIRECT_DEPOSIT_ERROR_KEYS.UNSPECIFIED_ERROR,
      DIRECT_DEPOSIT_ERROR_KEYS.GENERIC_ERROR,
    ],
    errorTexts: ['day phone number', 'day area number'],
  }) ||
  hasErrorCombos({
    errors,
    errorKeys: [
      DIRECT_DEPOSIT_ERROR_KEYS.DAY_PHONE_NUMBER_INVALID,
      DIRECT_DEPOSIT_ERROR_KEYS.DAY_PHONE_AREA_INVALID,
    ],
  });

// the cases for payment restriction indicators present include:
// - payment restrictions present error code
export const hasPaymentRestrictionIndicatorsError = errors =>
  hasErrorCombos({
    errors,
    errorKeys: [DIRECT_DEPOSIT_ERROR_KEYS.PAYMENT_RESTRICTIONS_PRESENT],
  });

// BEGIN TODO: remove this once the direct deposit form is updated to use single form
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
// END TODO: remove this once the direct deposit form is updated to use single form

const getLighthouseErrorCode = (errors = []) => {
  // there should only be one error code in the errors array, but just in case
  const error = errors.find(err => err?.code);
  return `${error?.code || OTHER_ERROR_GA_KEY} | ${error?.detail || ''}`;
};

export const getHealthCareSettingsHubDescription = ({
  hideHealthCareContacts,
  isSchedulingPreferencesPilotEligible,
}) => {
  const healthCareSettingsItems = [];
  if (!hideHealthCareContacts) {
    healthCareSettingsItems.push('health care contacts');
  }
  healthCareSettingsItems.push('messages signature');
  if (isSchedulingPreferencesPilotEligible) {
    healthCareSettingsItems.push('scheduling preferences');
  }
  if (hideHealthCareContacts && !isSchedulingPreferencesPilotEligible) {
    healthCareSettingsItems.push('other health care settings');
  }
  return capitalize(oxfordCommaList(healthCareSettingsItems));
};

// Helper that creates and returns an object to pass to the recordEvent()
// function when an error occurs while trying to save/update a user's direct
// deposit information. The value of the `error-key` prop will change depending
// on the content of the `errors` array.
export const createDirectDepositAnalyticsDataObject = ({
  errors = [],
  isEnrolling = false,
} = {}) => {
  const errorCode = getLighthouseErrorCode(errors);

  return cloneDeep({
    event: 'profile-edit-failure',
    'profile-action': 'save-failure',
    'profile-section': `direct-deposit-information`,
    'error-key': `${errorCode}${isEnrolling ? '-enroll' : '-update'}`,
  });
};

export function recordApiEvent(
  { endpoint, status, method = 'GET', extraProperties = {} },
  recordAnalyticsEvent = recordEvent,
) {
  const payload = {
    event: 'api_call',
    'api-name': `${method} ${endpoint}`,
    'api-status': status,
  };

  const errorKey = extraProperties?.['error-key'];

  if (errorKey) {
    payload['error-key'] = errorKey;
  }

  recordAnalyticsEvent(payload);
}
