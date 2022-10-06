import _ from 'platform/utilities/data';
import { isValidPhone, isValidEmail } from 'platform/forms/validations';
import { MILITARY_CITY_CODES, MILITARY_STATE_CODES } from '../constants';

export const pathWithIndex = (path, index) => path.replace(':index', index);

export const isValidZIP = value => {
  if (value !== null) {
    return /^\d{5}(?:(?:[-\s])?\d{4})?$/.test(value);
  }
  return true;
};

export const validateZIP = (errors, zip) => {
  if (zip && !isValidZIP(zip)) {
    errors.addError(
      'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
    );
  }
};

export const validateMilitaryCity = (
  errors,
  city,
  formData,
  schema,
  messages,
  options,
  arrayIndex,
) => {
  const isMilitaryState = MILITARY_STATE_CODES.includes(
    _.get(
      `${pathWithIndex(options.addressPath, arrayIndex)}.state`,
      formData,
      '',
    ),
  );
  const isMilitaryCity = MILITARY_CITY_CODES.includes(
    city.trim().toUpperCase(),
  );
  if (isMilitaryState && !isMilitaryCity) {
    errors.addError(
      'City must match APO, DPO, or FPO when using a military state code',
    );
  }
};

export const validateMilitaryState = (
  errors,
  state,
  formData,
  schema,
  messages,
  options,
  arrayIndex,
) => {
  const isMilitaryCity = MILITARY_CITY_CODES.includes(
    _.get(
      `${pathWithIndex(options.addressPath, arrayIndex)}.city`,
      formData,
      '',
    )
      .trim()
      .toUpperCase(),
  );
  const isMilitaryState = MILITARY_STATE_CODES.includes(state);
  if (isMilitaryCity && !isMilitaryState) {
    errors.addError('State must be AA, AE, or AP when using a military city');
  }
};

export const validateCurrency = (errors, currencyAmount) => {
  const regex = /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/;

  if (!regex.test(currencyAmount) || Number(currencyAmount) < 0) {
    errors.addError('Please enter a valid dollar amount.');
  }
};

export const isValidateCurrency = currencyAmount => {
  const regex = /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/;

  return regex.test(currencyAmount) || !Number(currencyAmount) < 0;
};

export const validatePhone = (errors, phone) => {
  if (phone && !isValidPhone(phone)) {
    errors.addError('Please enter a valid phone number.');
  }
};

export const validateEmail = (errors, email) => {
  if (email && !isValidEmail(email)) {
    errors.addError('Please enter a valid email address.');
  }
};

export const validateResolutionOption = (errors, fieldData) => {
  if (
    fieldData &&
    (fieldData.resolutionOption !== 'waiver' &&
      fieldData.resolutionOption !== 'compromise' &&
      fieldData.resolutionOption !== 'monthly')
  ) {
    errors.addError('Please select a resolution option');
  }
};

export const validateResolutionAmount = (errors, fieldData, formData) => {
  const { debtType, resolutionOption } = formData;

  if (resolutionOption !== 'waiver' && !fieldData) {
    errors.addError('Please enter a valid dollar amount.');
  }

  // Checking compromise/monthly resolution amount against remaining debt amount
  if (
    (debtType === 'DEBT' && formData?.currentAr <= fieldData) ||
    (debtType === 'COPAY' && formData?.pHAmtDue <= fieldData)
  ) {
    errors.addError('Please enter a value less than the current balance.');
  }
};

export const validateWaiverCheckbox = (errors, fieldData) => {
  if (
    fieldData &&
    (fieldData.resolutionOption === 'waiver' &&
      !fieldData.resolutionWaiverCheck)
  ) {
    errors.addError('You must agree by checking the box.');
  }
};
