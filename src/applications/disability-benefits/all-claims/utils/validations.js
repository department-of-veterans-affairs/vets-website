import { convertToDateField } from '~/platform/forms-system/src/js/validation';
import { isValidDateRange } from '~/platform/forms/validations';

/* The particular field used for the Toxic Exposure date inputs properly executes
* validateCurrentOrPastDate, however validations against the individual fields
* (day, month, year) do not properly block the Veteran from progressing.
* These validations are necessary to properly block progression and prevent what
* we're calling the 'XX' date issue.
*
* Note to adjust this logic if we choose to update how we accommodate partial dates
* for Toxic Exposure.
*/
export function validateToxicExposureGulfWar1990Dates(
  errors,
  { startDate, endDate },
) {
  // With these fields in particular, a missing value will convert to
  // a date format with 'XX' e.g. 01-XX-1990.
  // Calling convertToDateField on such a value will return an empty date object.
  // We will validate around this fact.
  const startDateApproximate = convertToDateField(startDate);
  const endDateApproximate = convertToDateField(endDate);

  const messages = {
    range: 'Your service start date must be before your end date',
    enddate: 'Service end date must be after August 2, 1990',
    maximumyear: 'Service year can not be greater than 2125',
    missingvalue: 'Please enter a value',
  };

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

  if (startDateApproximate.year.value > 2125) {
    errors.startDate.addError(messages.maximumyear);
  }

  if (endDateApproximate.year.value > 2125) {
    errors.endDate.addError(messages.maximumyear);
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

  const messages = {
    range: 'Your service start date must be before your end date',
    enddate: 'Service end date must be after August 2, 1990',
    maximumyear: 'Service year can not be greater than 2125',
    missingvalue: 'Please enter a value',
  };

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

  if (startDateApproximate.year.value > 2125) {
    errors.startDate.addError(messages.maximumyear);
  }

  if (endDateApproximate.year.value > 2125) {
    errors.endDate.addError(messages.maximumyear);
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

  const messages = {
    range: 'Your service start date must be before your end date',
    enddate: 'Service end date must be after August 2, 1990',
    maximumyear: 'Service year can not be greater than 2125',
    missingvalue: 'Please enter a value',
  };

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

  if (startDateApproximate.year.value > 2125) {
    errors.startDate.addError(messages.maximumyear);
  }

  if (endDateApproximate.year.value > 2125) {
    errors.endDate.addError(messages.maximumyear);
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

  const messages = {
    range: 'Your service start date must be before your end date',
    enddate: 'Service end date must be after August 2, 1990',
    maximumyear: 'Service year can not be greater than 2125',
    missingvalue: 'Please enter a value',
  };

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

  if (startDateApproximate.year.value > 2125) {
    errors.startDate.addError(messages.maximumyear);
  }

  if (endDateApproximate.year.value > 2125) {
    errors.endDate.addError(messages.maximumyear);
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
