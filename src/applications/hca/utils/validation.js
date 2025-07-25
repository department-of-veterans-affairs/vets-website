import { isEqual } from 'lodash';
import { add, format, isAfter, isValid, isWithinInterval } from 'date-fns';
import {
  convertToDateField,
  validateCurrentOrPastDate,
} from 'platform/forms-system/src/js/validation';
import { isValidDateRange } from 'platform/forms/validations';
import content from '../locales/en/content.json';
import { canHaveEducationExpenses, replaceStrValues } from './helpers';

// declare shared regex patterns
const CURRENCY_PATTERN = /^\$?(\d{1,3}(,\d{3})*|\d+)(\.\d{1,2})?$/;
const SSN_PATTERN = /^[0-9]{9}$/;

/**
 * Validates Veteran service dates
 * @param {Object} errors - object holding the error message content
 * @param {Object} fieldData - field data from the form inputs
 * @param {Object} formData - the global data object
 */
export const validateServiceDates = (
  errors,
  { lastDischargeDate, lastEntryDate },
  { veteranDateOfBirth },
) => {
  const fromDate = convertToDateField(lastEntryDate);
  const toDate = convertToDateField(lastDischargeDate);
  const dateOfBirthPlus15 = add(new Date(veteranDateOfBirth), { years: 15 });
  const yearFromToday = add(new Date(), { years: 1 });
  const endDate = format(yearFromToday, 'MMMM d, yyyy');
  const messages = {
    entryDate: content['validation-error--service-entry-date'],
    dischargeDate: replaceStrValues(
      content['validation-error--service-discharge-date'],
      endDate,
    ),
  };

  if (
    veteranDateOfBirth &&
    isAfter(dateOfBirthPlus15, new Date(lastEntryDate))
  ) {
    errors.lastEntryDate.addError(messages.entryDate);
  }

  if (
    !isValidDateRange(fromDate, toDate) ||
    isAfter(new Date(lastDischargeDate), yearFromToday)
  ) {
    errors.lastDischargeDate.addError(messages.dischargeDate);
  }
};

/**
 * Validates date format and date range of declared Gulf War service
 * @param {Object} errors - object holding the error message content
 * @param {Object} fieldData - field data from the form inputs
 */
export const validateGulfWarDates = (
  errors,
  { gulfWarStartDate, gulfWarEndDate },
) => {
  const fromDate = convertToDateField(gulfWarStartDate);
  const toDate = convertToDateField(gulfWarEndDate);
  const messages = {
    range: content['validation-error--gulf-war-date-range'],
    format: content['validation-error--month-year-date-format'],
  };

  if (fromDate.month.value && !fromDate.year.value) {
    errors.gulfWarStartDate.addError(messages.format);
  }

  if (toDate.month.value && !toDate.year.value) {
    errors.gulfWarEndDate.addError(messages.format);
  }

  if (!isValidDateRange(fromDate, toDate) && !isEqual(fromDate, toDate)) {
    errors.gulfWarEndDate.addError(messages.range);
  }
};

/**
 * Validates date format and date range of declared toxic exposure
 * @param {Object} errors - object holding the error message content
 * @param {Object} fieldData - field data from the form inputs
 */
export const validateExposureDates = (
  errors,
  { toxicExposureStartDate, toxicExposureEndDate },
) => {
  const fromDate = convertToDateField(toxicExposureStartDate);
  const toDate = convertToDateField(toxicExposureEndDate);
  const messages = {
    range: content['validation-error--exposure-date-range'],
    format: content['validation-error--month-year-date-format'],
  };

  if (fromDate.month.value && !fromDate.year.value) {
    errors.toxicExposureStartDate.addError(messages.format);
  }

  if (toDate.month.value && !toDate.year.value) {
    errors.toxicExposureEndDate.addError(messages.format);
  }

  if (!isValidDateRange(fromDate, toDate) && !isEqual(fromDate, toDate)) {
    errors.toxicExposureEndDate.addError(messages.range);
  }
};

/**
 * Validates the date became dependent with the dependent birthdate
 * @param {Object} errors - object holding the error message content
 * @param {String} fieldData - field data from the date input
 * @param {Object} formData - the global data object
 */
export const validateDependentDate = (errors, fieldData, { dateOfBirth }) => {
  const dateValue = new Date(fieldData);
  const birthDate = new Date(dateOfBirth);
  if (isAfter(birthDate, dateValue)) {
    errors.addError(content['validation-error--dependent-date']);
  }
  validateCurrentOrPastDate(errors, fieldData);
};

/**
 * Validates if currency value is of valid format
 * HACK: Due to us-forms-system issue 269 (https://github.com/usds/us-forms-system/issues/269)
 * Source: https://stackoverflow.com/a/16242575
 * @param {Object} errors - object holding the error message content
 * @param {String} fieldData - field data from the text input
 */
export const validateCurrency = (errors, currencyAmount) => {
  if (!CURRENCY_PATTERN.test(currencyAmount)) {
    errors.addError(content['validation-error--currency-format']);
  }
};

/**
 * Validates if insurance policy number or group code is present
 * @param {Object} errors - object holding the error message content
 * @param {Object} fieldData - field data for individual array item
 */
export const validatePolicyNumber = (
  errors,
  { insurancePolicyNumber, insuranceGroupCode },
) => {
  const messages = {
    groupCode: content['validation-error--group-code'],
    policyNumber: content['validation-error--policy-number'],
  };

  if (!insurancePolicyNumber && !insuranceGroupCode) {
    errors.insuranceGroupCode.addError(messages.groupCode);
    errors.insurancePolicyNumber.addError(messages.policyNumber);
  }
};

/**
 * Validates if insurance policy array item data is valid
 * @param {Object} item - field data for individual array item
 * @returns {Boolean} - false if the item missing any required data
 */
export const validateInsurancePolicy = ({
  insuranceName,
  insurancePolicyHolderName,
  'view:policyNumberOrGroupCode': {
    insurancePolicyNumber,
    insuranceGroupCode,
  } = {},
} = {}) =>
  !insuranceName ||
  !insurancePolicyHolderName ||
  (!insurancePolicyNumber && !insuranceGroupCode);

/**
 * Validates date of birth value for accepted range and valid date format
 * @param {String} dateOfBirth - date string for the Veteran date of birth
 * @returns {String|null} - the valid dates string or null if value is invalid
 */
export const validateDateOfBirth = dateOfBirth => {
  if (!dateOfBirth) return null;

  const birthdate = new Date(dateOfBirth);

  if (!isValid(birthdate)) return null;
  if (
    !isWithinInterval(birthdate, {
      start: new Date('1900-01-01'),
      end: new Date(),
    })
  )
    return null;

  return dateOfBirth;
};

/**
 * Validates if dependent array item data is valid
 * @param {Object} item - field data for individual array item
 * @returns {Boolean} - false if the item missing any required data
 */
export const validateDependent = (formData = {}) => {
  const {
    fullName,
    dependentRelation,
    socialSecurityNumber,
    dateOfBirth,
    becameDependent,
    disabledBefore18,
    cohabitedLastYear,
    dependentEducationExpenses,
    'view:dependentIncome': dependentIncome,
    'view:grossIncome': { grossIncome } = {},
    'view:netIncome': { netIncome } = {},
    'view:otherIncome': { otherIncome } = {},
  } = formData;

  const isValidCurrency = val => {
    if (val === undefined || val === '') return false;
    return typeof val === 'string' && CURRENCY_PATTERN.test(val);
  };
  const isValidSsn = val => typeof val === 'string' && SSN_PATTERN.test(val);

  if (!fullName?.firstName || !fullName?.lastName) return true;
  if (!dependentRelation) return true;
  if (!isValidSsn(socialSecurityNumber)) return true;
  if (!validateDateOfBirth(dateOfBirth)) return true;

  const birthDate = new Date(dateOfBirth);
  const dependentDate = new Date(becameDependent);
  if (isAfter(birthDate, dependentDate)) return true;

  if (disabledBefore18 === undefined) return true;
  if (cohabitedLastYear === undefined) return true;

  if (dependentIncome) {
    const incomeFields = [grossIncome, netIncome, otherIncome];
    const allFieldsHaveValues = incomeFields.every(val => {
      if (!isValidCurrency(val)) return false;
      const numericValue = parseFloat(val.replace(/[$,]/g, ''));
      // eslint-disable-next-line no-restricted-globals
      return !isNaN(numericValue) && numericValue >= 0;
    });

    if (!allFieldsHaveValues) return true;
  }

  const needsEducationExpenses = canHaveEducationExpenses({
    dateOfBirth,
    'view:grossIncome': { grossIncome },
  });

  return needsEducationExpenses && !isValidCurrency(dependentEducationExpenses);
};
