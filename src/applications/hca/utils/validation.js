import { isEqual } from 'lodash';
import { add, format, isAfter } from 'date-fns';
import {
  convertToDateField,
  validateCurrentOrPastDate,
} from '~/platform/forms-system/src/js/validation';
import { isValidDateRange } from '~/platform/forms/validations';

export function validateServiceDates(
  errors,
  { lastDischargeDate, lastEntryDate },
  { veteranDateOfBirth },
) {
  const fromDate = convertToDateField(lastEntryDate);
  const toDate = convertToDateField(lastDischargeDate);
  const yearFromToday = add(new Date(), { years: 1 });
  const endDate = format(yearFromToday, 'MMMM d, yyyy');

  if (veteranDateOfBirth) {
    const dateOfBirthPlus15 = add(new Date(veteranDateOfBirth), { years: 15 });

    if (isAfter(dateOfBirthPlus15, new Date(lastEntryDate))) {
      errors.lastEntryDate.addError(
        'You must have been at least 15 years old when you entered the service',
      );
    }
  }

  if (
    !isValidDateRange(fromDate, toDate) ||
    isAfter(new Date(lastDischargeDate), yearFromToday)
  ) {
    errors.lastDischargeDate.addError(
      `Discharge date must be after the service period start date and before ${endDate} (1 year from today)`,
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
    range: 'Service end date must be after the service start date',
    format: 'Enter a date that includes a month and year',
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
}

export function validateExposureDates(
  errors,
  { toxicExposureStartDate, toxicExposureEndDate },
) {
  const fromDate = convertToDateField(toxicExposureStartDate);
  const toDate = convertToDateField(toxicExposureEndDate);
  const messages = {
    range: 'Exposure end date must be after the exposure start date',
    format: 'Enter a date that includes a month and year',
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
}

export function validateDependentDate(errors, fieldData, { dateOfBirth }) {
  if (isAfter(new Date(dateOfBirth), new Date(fieldData))) {
    errors.addError(
      'This date must come after the dependent\u2019s birth date',
    );
  }
  validateCurrentOrPastDate(errors, fieldData);
}

/**
 * Source: https://stackoverflow.com/a/16242575
 * HACK: Due to us-forms-system issue 269 (https://github.com/usds/us-forms-system/issues/269)
 */
export function validateCurrency(errors, currencyAmount) {
  const pattern = /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/;

  if (!pattern.test(currencyAmount)) {
    errors.addError('Enter a valid dollar amount');
  }
}

export function validatePolicyNumber(errors, fieldData) {
  const { insurancePolicyNumber, insuranceGroupCode } = fieldData;

  if (!insurancePolicyNumber && !insuranceGroupCode) {
    errors.insuranceGroupCode.addError(
      'Group code (either this or the policy number is required)',
    );
    errors.insurancePolicyNumber.addError(
      'Policy number (either this or the group code is required)',
    );
  }
}
