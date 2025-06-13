import moment from 'moment';
import { convertToDateField } from '~/platform/forms-system/src/js/validation';
import { isValidDateRange } from '~/platform/forms/validations';

const messages = {
  range: 'Enter a service start date that’s before your end date.',
  enddate1990: 'Enter a service end date after August 2, 1990.',
  enddate2001: 'Enter a service end date after September 11, 2001.',
  // This is largely redundant because the component validation already prevents
  // inputting dates in the future. However, this is in place just in case, because...
  // TODO: The current schema validation says that the Veteran can input a year
  // up to 100 years in the future. That is incorrect and should be corrected/removed.
  futuredate: 'Enter a service year that’s before or during the current year.',
  // Schema validations will display an error when a value is missing, however it
  // will not properly prevent the Veteran from progressing, necessitating this.
  // TODO: The error message here can be made more specific, but that will somewhat
  // depend on what decisions (and schema updates) are made in regards to partial dates.
  missingvalue: 'Enter a service date that includes the month, day, and year.',
};

/* The particular field used for the Toxic Exposure date inputs properly executes
* validateCurrentOrPastDate, however schema validations against the individual fields
* (day, month, year) do not properly block the Veteran from progressing.
* These validations are necessary to properly block progression and prevent what
* we're calling the 'XX' date issue.
*/
export function validateToxicExposureGulfWar1990Dates(
  errors,
  { startDate, endDate },
) {
  // With these fields in particular, a missing value will convert to
  // a date format with 'XX' e.g. 01-XX-1990.
  // Calling convertToDateField on a partial date will return an empty date object.
  // We will validate around this fact.
  const startDateApproximate = convertToDateField(startDate);
  const endDateApproximate = convertToDateField(endDate);

  // Range validations
  if (!isValidDateRange(startDateApproximate, endDateApproximate)) {
    errors.endDate.addError(messages.range);
  }

  if (
    endDateApproximate.year.value < 1990 ||
    (endDateApproximate.year.value === 1990 &&
      endDateApproximate.day.value < 8 &&
      endDateApproximate.month.value < 2)
  ) {
    errors.endDate.addError(messages.enddate);
  }

  if (startDateApproximate > moment()) {
    errors.startDate.addError(messages.futuredate);
  }

  if (endDateApproximate > moment()) {
    errors.endDate.addError(messages.futuredate);
  }

  // Validations against empty date object due to missing value
  if (
    !startDateApproximate.day.value ||
    !startDateApproximate.month.value ||
    !startDateApproximate.year.value
  ) {
    errors.startDate.addError(messages.missingvalue);
  }

  if (
    !endDateApproximate.day.value ||
    !endDateApproximate.month.value ||
    !endDateApproximate.year.value
  ) {
    errors.endDate.addError(messages.missingvalue);
  }
}

export function validateToxicExposureGulfWar2001Dates(
  errors,
  { startDate, endDate },
) {
  const startDateApproximate = convertToDateField(startDate);
  const endDateApproximate = convertToDateField(endDate);

  // Range validations
  if (!isValidDateRange(startDateApproximate, endDateApproximate)) {
    errors.endDate.addError(messages.range);
  }

  if (
    endDateApproximate.year.value < 2001 ||
    (endDateApproximate.year.value === 2001 &&
      endDateApproximate.day.value < 11 &&
      endDateApproximate.month.value < 9)
  ) {
    errors.endDate.addError(messages.enddate);
  }

  if (startDateApproximate < moment()) {
    errors.startDate.addError(messages.futuredate);
  }

  if (endDateApproximate < moment()) {
    errors.endDate.addError(messages.futuredate);
  }

  // Validations against empty date object due to missing value
  if (
    !startDateApproximate.day.value ||
    !startDateApproximate.month.value ||
    !startDateApproximate.year.value
  ) {
    errors.startDate.addError(messages.missingvalue);
  }

  if (
    !endDateApproximate.day.value ||
    !endDateApproximate.month.value ||
    !endDateApproximate.year.value
  ) {
    errors.endDate.addError(messages.missingvalue);
  }
}

export function validateToxicExposureHerbicideDates(
  errors,
  { startDate, endDate },
) {
  const startDateApproximate = convertToDateField(startDate);
  const endDateApproximate = convertToDateField(endDate);

  // Range validations
  if (!isValidDateRange(startDateApproximate, endDateApproximate)) {
    errors.endDate.addError(messages.range);
  }

  if (startDateApproximate < moment()) {
    errors.startDate.addError(messages.futuredate);
  }

  if (endDateApproximate > moment()) {
    errors.endDate.addError(messages.futuredate);
  }

  // Validations against empty date object due to missing value
  if (
    !startDateApproximate.day.value ||
    !startDateApproximate.month.value ||
    !startDateApproximate.year.value
  ) {
    errors.startDate.addError(messages.missingvalue);
  }

  if (
    !endDateApproximate.day.value ||
    !endDateApproximate.month.value ||
    !endDateApproximate.year.value
  ) {
    errors.endDate.addError(messages.missingvalue);
  }
}

export function validateToxicExposureAdditionalExposuresDates(
  errors,
  { startDate, endDate },
) {
  const startDateApproximate = convertToDateField(startDate);
  const endDateApproximate = convertToDateField(endDate);

  // Range validations
  if (!isValidDateRange(startDateApproximate, endDateApproximate)) {
    errors.endDate.addError(messages.range);
  }

  if (startDateApproximate > moment()) {
    errors.startDate.addError(messages.futuredate);
  }

  if (endDateApproximate.year > moment()) {
    errors.endDate.addError(messages.futuredate);
  }

  // Validations against empty date object due to missing value
  if (
    !startDateApproximate.day.value ||
    !startDateApproximate.month.value ||
    !startDateApproximate.year.value
  ) {
    errors.startDate.addError(messages.missingvalue);
  }

  if (
    !endDateApproximate.day.value ||
    !endDateApproximate.month.value ||
    !endDateApproximate.year.value
  ) {
    errors.endDate.addError(messages.missingvalue);
  }
}
