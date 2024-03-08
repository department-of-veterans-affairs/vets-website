import moment from 'moment';
import {
  convertToDateField,
  validateCurrentOrPastDate,
} from 'platform/forms-system/src/js/validation';
import { isValidDateRange } from 'platform/forms/validations';

export function validateServiceDates(
  errors,
  { lastDischargeDate, lastEntryDate },
  { veteranDateOfBirth },
) {
  const fromDate = convertToDateField(lastEntryDate);
  const toDate = convertToDateField(lastDischargeDate);
  const endDate = moment()
    .endOf('day')
    .add(1, 'years');

  if (
    !isValidDateRange(fromDate, toDate) ||
    moment(lastDischargeDate, 'YYYY-MM-DD').isAfter(endDate)
  ) {
    errors.lastDischargeDate.addError(
      `Discharge date must be after the service period start date and before ${endDate.format(
        'MMMM D, YYYY',
      )} (1 year from today)`,
    );
  }

  if (veteranDateOfBirth) {
    const dateOfBirth = moment(veteranDateOfBirth);

    if (dateOfBirth.add(15, 'years').isAfter(moment(lastEntryDate))) {
      errors.lastEntryDate.addError(
        'You must have been at least 15 years old when you entered the service',
      );
    }
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

  if (!isValidDateRange(fromDate, toDate)) {
    errors.gulfWarEndDate.addError(messages.range);
  }

  if (fromDate.month.value && !fromDate.year.value) {
    errors.gulfWarStartDate.addError(messages.format);
  }

  if (toDate.month.value && !toDate.year.value) {
    errors.gulfWarEndDate.addError(messages.format);
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

  if (!isValidDateRange(fromDate, toDate)) {
    errors.toxicExposureEndDate.addError(messages.range);
  }

  if (fromDate.month.value && !fromDate.year.value) {
    errors.toxicExposureStartDate.addError(messages.format);
  }

  if (toDate.month && !toDate.year) {
    errors.toxicExposureEndDate.addError(messages.format);
  }
}

export function validateDependentDate(errors, fieldData, { dateOfBirth }) {
  const dependentDate = moment(fieldData);
  const birthDate = moment(dateOfBirth);

  if (birthDate.isAfter(dependentDate)) {
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
  if (
    !/(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/.test(
      currencyAmount,
    )
  ) {
    errors.addError('Please enter a valid dollar amount');
  }
}
