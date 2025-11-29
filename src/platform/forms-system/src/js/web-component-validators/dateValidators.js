/* eslint-disable sonarjs/no-collapsible-if */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
/**
 * Date validation helpers mimicking what component-library should export.
 *
 * These mock validator functions replicate component-library's validation logic
 * to check if a date component would have errors. This allows forms-system to
 * avoid duplicate error messages when the component already has validation errors.
 *
 * Note: This is a temporary implementation. Once component-library validates on
 * each input blur AND exports these validators, we can replace with:
 * import { validateMemorableDate, validateDate }
 *   from '@department-of-veterans-affairs/component-library/validators';
 */

/**
 * Core validation function replicated from component-library's date-utils.ts.
 * Source: https://github.com/department-of-veterans-affairs/component-library/blob/main/packages/web-components/src/utils/date-utils.ts
 *
 * This is a private helper function used by the mock validators.
 * @private
 */
function validate({
  component,
  year,
  month,
  day,
  monthYearOnly = false,
  yearTouched = true,
  monthTouched = true,
  dayTouched = true,
  monthSelect = false,
  monthOptional = false,
}) {
  const minYear = 1900;
  const maxYear = new Date().getFullYear() + 100;
  const minMonths = 1;
  const maxMonths = 12;
  const minDays = 1;

  // Get days in month considering leap years
  const daysForSelectedMonth = (y, m) => {
    if (!y || !m) return 31;
    return new Date(y, m, 0).getDate();
  };

  const getMonthErrorKey = isSelect =>
    isSelect ? 'month-select' : 'month-range';

  // Don't validate if all values are empty
  if (!year && !month && !day) {
    return;
  }

  const maxDays = daysForSelectedMonth(year, month);

  // Reset previous invalid states
  component.invalidYear = false;
  component.invalidMonth = false;
  component.invalidDay = false;

  const monthRequired = !(monthYearOnly && monthOptional);

  // Check NaN and set errors based on NaN values
  if (monthRequired && isNaN(month) && monthTouched) {
    component.invalidMonth = true;
    component.error = getMonthErrorKey(monthSelect);
    return;
  }
  if (!monthYearOnly && isNaN(day) && dayTouched) {
    component.invalidDay = true;
    component.error = 'day-range';
    return;
  }
  if (isNaN(year) && yearTouched) {
    component.invalidYear = true;
    component.error = 'year-range';
    return;
  }

  // Validate required fields
  if (
    component.required &&
    (!year || (monthRequired && !month) || (!monthYearOnly && !day))
  ) {
    if (monthRequired && monthTouched && !month) {
      component.invalidMonth = true;
      component.error = 'date-error';
      return;
    }
    if (dayTouched && !day && !monthYearOnly) {
      component.invalidDay = true;
      component.error = 'date-error';
      return;
    }
    if (yearTouched && !year) {
      component.invalidYear = true;
      component.error = 'date-error';
      return;
    }
  }

  // Check for empty values after the fields are touched
  if (monthRequired && !month && monthTouched) {
    component.invalidMonth = true;
    component.error = getMonthErrorKey(monthSelect);
    return;
  }
  if (!day && !monthYearOnly && dayTouched) {
    component.invalidDay = true;
    component.error = 'day-range';
    return;
  }
  if (!year && yearTouched) {
    component.invalidYear = true;
    component.error = 'year-range';
    return;
  }

  // Validate year, month, and day ranges if they have a value
  if (
    monthRequired &&
    month &&
    (month < minMonths || month > maxMonths) &&
    monthTouched
  ) {
    component.invalidMonth = true;
    component.error = getMonthErrorKey(monthSelect);
    return;
  }
  if (day && !monthYearOnly && (day < minDays || day > maxDays) && dayTouched) {
    component.invalidDay = true;
    component.error = 'day-range';
    return;
  }
  if (year && (year < minYear || year > maxYear) && yearTouched) {
    component.invalidYear = true;
    component.error = 'year-range';
    return;
  }

  // If month is selected but day and year have not been touched, set error for untouched fields
  if (month && monthTouched && !dayTouched && !yearTouched) {
    if (!monthYearOnly) {
      component.invalidDay = true;
      component.error = 'date-error';
    } else {
      component.invalidYear = true;
      component.error = 'date-error';
    }
    return;
  }

  // If month and day is set but year has not been touched, set error
  if (month && monthTouched && day && dayTouched && !yearTouched) {
    component.invalidYear = true;
    component.error = 'date-error';
    return;
  }

  // Remove any error message if none of the fields are invalid
  const internalErrors = [
    'year-range',
    'day-range',
    'month-range',
    'date-error',
    'month-select',
  ];
  if (
    !component.invalidYear &&
    !component.invalidMonth &&
    !component.invalidDay
  ) {
    if (!component.error || internalErrors.includes(component.error)) {
      component.error = null;
    }
  }
}

/**
 * Validates a memorable date (MM/DD/YYYY format with text inputs).
 * Uses component-library's validate() function for 100% consistency.
 *
 * This mock validator checks if the component WOULD have validation errors.
 * Once component-library validates on each input blur, components will already
 * have error state set, and this just confirms that state.
 *
 * @param {number} year - The year value (can be NaN or null)
 * @param {number} month - The month value (can be NaN or null)
 * @param {number} day - The day value (can be NaN or null)
 * @param {boolean} required - Whether the date is required
 * @returns {string|null} Error code matching component-library translation keys, or null if valid
 */
export function validateMemorableDate(year, month, day, required = false) {
  // Create mock component object to receive validation results
  const mockComponent = {
    required,
    error: null,
    invalidYear: false,
    invalidMonth: false,
    invalidDay: false,
  };

  // Call validate with all touched flags true (simulating submit validation)
  validate({
    component: mockComponent,
    year,
    month,
    day,
    monthYearOnly: false,
    yearTouched: true,
    monthTouched: true,
    dayTouched: true,
    monthSelect: false, // va-memorable-date uses text inputs for month
    monthOptional: false,
  });

  return mockComponent.error;
}

/**
 * Validates a date input (YYYY-MM-DD format with select/input combination).
 * Uses component-library's validate() function for 100% consistency.
 *
 * This mock validator checks if the component WOULD have validation errors.
 * Once component-library validates on each input blur, components will already
 * have error state set, and this just confirms that state.
 *
 * @param {number} year - The year value (can be NaN or null)
 * @param {number} month - The month value (can be NaN or null)
 * @param {number} day - The day value (can be NaN or null)
 * @param {boolean} required - Whether the date is required
 * @param {boolean} monthYearOnly - Whether only month and year are required
 * @returns {string|null} Error code matching component-library translation keys, or null if valid
 */
export function validateDate(
  year,
  month,
  day,
  required = false,
  monthYearOnly = false,
) {
  // Create mock component object to receive validation results
  const mockComponent = {
    required,
    error: null,
    invalidYear: false,
    invalidMonth: false,
    invalidDay: false,
  };

  // Call validate with all touched flags true (simulating submit validation)
  validate({
    component: mockComponent,
    year,
    month,
    day,
    monthYearOnly,
    yearTouched: true,
    monthTouched: true,
    dayTouched: true,
    monthSelect: true, // va-date uses select for month
    monthOptional: false,
  });

  return mockComponent.error;
}
