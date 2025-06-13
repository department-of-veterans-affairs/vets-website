import { convertToDateField } from '~/platform/forms-system/src/js/validation';
import { isValidDateRange } from '~/platform/forms/validations';

const messages = {
  invalidRange: 'Enter a service start date that’s before your end date.',
  endDate1990: 'Enter a service end date after August 2, 1990.',
  endDate2001: 'Enter a service end date after September 11, 2001.',
  // This is largely redundant because the component validation already prevents
  // inputting dates in the future. However, this is in place just in case, because...
  // TODO: The current schema validation says that the Veteran can input a year
  // up to 100 years in the future. That is incorrect and should be corrected/removed.
  futureDate: 'Enter a service year that’s before or during the current year.',
  // Schema validations will display an error when a value is missing, however it
  // will not properly prevent the Veteran from progressing, necessitating this.
  // TODO: The error message here can be made more specific, but that will somewhat
  // depend on what decisions (and schema updates) are made in regards to partial dates.
  missingValue: 'Enter a service date that includes the month, day, and year.',
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
    errors.startDate.addError(messages.invalidRange);
  }

  if (Date(endDate ?? '') <= Date('1990-08-02')) {
    errors.endDate.addError(messages.endDate1990);
  }

  if (startDateApproximate > Date.now()) {
    errors.startDate.addError(messages.futureDate);
  }

  if (endDateApproximate > Date.now()) {
    errors.endDate.addError(messages.futureDate);
  }

  // Validations against empty date object due to missing value
  if (
    !startDateApproximate.day.value ||
    !startDateApproximate.month.value ||
    !startDateApproximate.year.value
  ) {
    errors.startDate.addError(messages.missingValue);
  }

  if (
    !endDateApproximate.day.value ||
    !endDateApproximate.month.value ||
    !endDateApproximate.year.value
  ) {
    errors.endDate.addError(messages.missingValue);
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
    errors.startDate.addError(messages.invalidRange);
  }

  if (Date(endDate ?? '') <= Date('2001-09-11')) {
    errors.endDate.addError(messages.endDate2001);
  }

  if (startDateApproximate > Date.now()) {
    errors.startDate.addError(messages.futureDate);
  }

  if (endDateApproximate > Date.now()) {
    errors.endDate.addError(messages.futureDate);
  }

  // Validations against empty date object due to missing value
  if (
    !startDateApproximate.day.value ||
    !startDateApproximate.month.value ||
    !startDateApproximate.year.value
  ) {
    errors.startDate.addError(messages.missingValue);
  }

  if (
    !endDateApproximate.day.value ||
    !endDateApproximate.month.value ||
    !endDateApproximate.year.value
  ) {
    errors.endDate.addError(messages.missingValue);
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
    errors.startDate.addError(messages.invalidRange);
  }

  if (startDateApproximate > Date.now()) {
    errors.startDate.addError(messages.futureDate);
  }

  if (endDateApproximate > Date.now()) {
    errors.endDate.addError(messages.futureDate);
  }

  // Validations against empty date object due to missing value
  if (
    !startDateApproximate.day.value ||
    !startDateApproximate.month.value ||
    !startDateApproximate.year.value
  ) {
    errors.startDate.addError(messages.missingValue);
  }

  if (
    !endDateApproximate.day.value ||
    !endDateApproximate.month.value ||
    !endDateApproximate.year.value
  ) {
    errors.endDate.addError(messages.missingValue);
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
    errors.startDate.addError(messages.invalidRange);
  }

  if (startDateApproximate > Date.now()) {
    errors.startDate.addError(messages.futureDate);
  }

  if (endDateApproximate > Date.now()) {
    errors.endDate.addError(messages.futureDate);
  }

  // Validations against empty date object due to missing value
  if (
    !startDateApproximate.day.value ||
    !startDateApproximate.month.value ||
    !startDateApproximate.year.value
  ) {
    errors.startDate.addError(messages.missingValue);
  }

  if (
    !endDateApproximate.day.value ||
    !endDateApproximate.month.value ||
    !endDateApproximate.year.value
  ) {
    errors.endDate.addError(messages.missingValue);
  }
}
