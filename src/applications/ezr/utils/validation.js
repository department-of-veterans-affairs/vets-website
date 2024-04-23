import moment from 'moment';
import { isEqual } from 'lodash';
import {
  convertToDateField,
  validateCurrentOrPastDate,
} from '~/platform/forms-system/src/js/validation';
import { isValidDateRange } from '~/platform/forms/validations';
import content from '../locales/en/content.json';

/**
 * HACK: Due to us-forms-system issue 269 (https://github.com/usds/us-forms-system/issues/269)
 * Validate input data against regex for propery currency formatting
 *
 * Source: https://stackoverflow.com/a/16242575
 * @param {Object} - errors - the error handling object from the forms system
 * @param {String} - fieldData - the value from the text input field
 */
export function validateCurrency(errors, fieldData) {
  const CURRENCY_FORMAT_REGEX = /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/;
  if (!CURRENCY_FORMAT_REGEX.test(fieldData)) {
    errors.addError(content['validation-currency-format']);
  }
}

/**
 * Validate input data to ensure dependent data is on or after the dependents
 * date of birth
 * @param {Object} - errors - the error handling object from the forms system
 * @param {String} - fieldData - the value from the text input field
 * @param {Object} - formData - the entire form data object
 */
export function validateDependentDate(errors, fieldData, { dateOfBirth }) {
  const dependentDate = moment(fieldData);
  const birthDate = moment(dateOfBirth);

  if (birthDate.isAfter(dependentDate)) {
    errors.addError(content['validation-dependent-date']);
  }
  validateCurrentOrPastDate(errors, fieldData);
}

/**
 * Validate insurance information to ensure either a policy number or group
 * code is provided
 * @param {Object} - errors - the error handling object from the forms system
 * @param {String} - fieldData - the value from the view field
 */
export function validatePolicyNumberGroupCode(errors, fieldData) {
  const { insurancePolicyNumber, insuranceGroupCode } = fieldData;
  if (!insurancePolicyNumber && !insuranceGroupCode) {
    errors.insuranceGroupCode.addError(
      content['validation-insurance-group-code'],
    );
    errors.insurancePolicyNumber.addError(
      content['validation-insurance-policy-number'],
    );
  }
}

export function validateGulfWarDates(
  errors,
  { gulfWarStartDate, gulfWarEndDate },
) {
  const fromDate = convertToDateField(gulfWarStartDate);
  const toDate = convertToDateField(gulfWarEndDate);
  const messages = {
    range: content['military-service-validation-gulf-war-range'],
    format: content['military-service-validation-toxic-exposure-format'],
  };

  // As of 4/2/2024, we are allowing users to enter the same month/date
  if (!isValidDateRange(fromDate, toDate) && !isEqual(fromDate, toDate)) {
    errors.gulfWarEndDate.addError(messages.range);
  }

  if (fromDate.month.value && !fromDate.year.value) {
    errors.gulfWarStartDate.addError(messages.format);
  }

  if (toDate.month.value && !toDate.year.value) {
    errors.gulfWarEndDate.addError(messages.format);
  }
}

export function validateAgentOrangeExposureDates(
  errors,
  { agentOrangeStartDate, agentOrangeEndDate },
) {
  const fromDate = convertToDateField(agentOrangeStartDate);
  const toDate = convertToDateField(agentOrangeEndDate);
  const messages = {
    range: content['military-service-validation-exposure-range'],
    format: content['military-service-validation-toxic-exposure-format'],
  };

  // As of 4/2/2024, we are allowing users to enter the same month/date
  if (!isValidDateRange(fromDate, toDate) && !isEqual(fromDate, toDate)) {
    errors.agentOrangeEndDate.addError(messages.range);
  }

  if (fromDate.month.value && !fromDate.year.value) {
    errors.agentOrangeStartDate.addError(messages.format);
  }

  if (toDate.month.value && !toDate.year.value) {
    errors.agentOrangeEndDate.addError(messages.format);
  }
}

export function validateExposureDates(
  errors,
  { toxicExposureStartDate, toxicExposureEndDate },
) {
  const fromDate = convertToDateField(toxicExposureStartDate);
  const toDate = convertToDateField(toxicExposureEndDate);
  const messages = {
    range: content['military-service-validation-exposure-range'],
    format: content['military-service-validation-toxic-exposure-format'],
  };

  // As of 4/2/2024, we are allowing users to enter the same month/date
  if (!isValidDateRange(fromDate, toDate) && !isEqual(fromDate, toDate)) {
    errors.toxicExposureEndDate.addError(messages.range);
  }

  if (fromDate.month.value && !fromDate.year.value) {
    errors.toxicExposureStartDate.addError(messages.format);
  }

  if (toDate.month.value && !toDate.year.value) {
    errors.toxicExposureEndDate.addError(messages.format);
  }
}
