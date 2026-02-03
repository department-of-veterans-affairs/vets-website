const messages = {
  invalidRange:
    'Enter a service start date that occurs earlier than your end date',
  endDate1990: 'Enter a service end date after August 2, 1990',
  endDate2001: 'Enter a service end date after September 11, 2001',
  // This is largely redundant because the component validation already prevents
  // inputting dates in the future. However, this is in place just in case, because...
  // TODO: The current schema validation says that the Veteran can input a year
  // up to 100 years in the future. That is incorrect and should be corrected/removed.
  endServiceDate: 'Enter a service end date no later than today’s date',
  startServiceDate: 'Enter a service start date no later than today’s date',
};

/**
 * Parse a date string into numeric components
 * @param {string} dateString - Date string in format YYYY-MM (month/year) or YYYY-XX (year-only)
 * @returns {Object} Object with year, month as numbers or null
 */
function parseDateComponents(dateString) {
  if (!dateString) return { year: null, month: null };
  const [year, month] = dateString.split('-');
  return {
    year: year && year !== 'XXXX' ? Number(year) : null,
    month: month && month !== 'XX' ? Number(month) : null,
  };
}

/**
 * Check if a date is in the future
 * @param {Object} dateComponents - Object with year, month
 * @param {Object} currentComponents - Object with current year, month
 * @returns {boolean} True if date is in the future
 */
function isFutureDate(dateComponents, currentComponents) {
  if (!dateComponents.year) return false;
  if (dateComponents.year > currentComponents.year) return true;
  if (dateComponents.year < currentComponents.year) return false;
  if (!dateComponents.month) return false;
  return dateComponents.month > currentComponents.month;
}

/**
 * Check if start date is after end date
 * @param {Object} startComponents - Start date components
 * @param {Object} endComponents - End date components
 * @returns {boolean} True if start is after end
 */
function isStartAfterEnd(startComponents, endComponents) {
  if (!startComponents.year || !endComponents.year) return false;
  if (startComponents.year > endComponents.year) return true;
  if (startComponents.year < endComponents.year) return false;
  if (!startComponents.month || !endComponents.month) return false;
  return startComponents.month > endComponents.month;
}

/**
 * Get current date components
 * @returns {Object} Object with current year, month
 */
function getCurrentDateComponents() {
  return {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  };
}

/**
 * Validate month/year dates for Gulf War 1990
 * Supports year-only (YYYY-XX) or year+month (YYYY-MM)
 */
export function validateToxicExposureGulfWar1990Dates(
  errors,
  { startDate, endDate },
) {
  // Individual date formats are validated by validateApproximateMonthYearDate in uiSchema

  const current = getCurrentDateComponents();

  // Validate date range
  if (startDate && endDate) {
    const start = parseDateComponents(startDate);
    const end = parseDateComponents(endDate);

    if (isStartAfterEnd(start, end)) {
      errors.startDate.addError(messages.invalidRange);
      return;
    }
  }

  // Validate dates are not in the future
  if (startDate) {
    const start = parseDateComponents(startDate);
    if (isFutureDate(start, current)) {
      errors.startDate.addError(messages.startServiceDate);
    }
  }

  if (endDate) {
    const end = parseDateComponents(endDate);

    if (isFutureDate(end, current)) {
      errors.endDate.addError(messages.endServiceDate);
    }

    // Validate end date is after August 2, 1990 (accepts 1990-XX and 1990-08)
    if (
      (end.year && end.year < 1990) ||
      (end.year === 1990 && end.month && end.month < 8)
    ) {
      errors.endDate.addError(messages.endDate1990);
    }
  }
}

/**
 * Validate month/year dates for Gulf War 2001
 * Supports year-only (YYYY-XX) or year+month (YYYY-MM)
 */
export function validateToxicExposureGulfWar2001Dates(
  errors,
  { startDate, endDate },
) {
  // Individual date formats are validated by validateApproximateMonthYearDate in uiSchema

  const current = getCurrentDateComponents();

  // Validate date range
  if (startDate && endDate) {
    const start = parseDateComponents(startDate);
    const end = parseDateComponents(endDate);

    if (isStartAfterEnd(start, end)) {
      errors.startDate.addError(messages.invalidRange);
      return;
    }
  }

  // Validate dates are not in the future
  if (startDate) {
    const start = parseDateComponents(startDate);
    if (isFutureDate(start, current)) {
      errors.startDate.addError(messages.startServiceDate);
    }
  }

  if (endDate) {
    const end = parseDateComponents(endDate);

    if (isFutureDate(end, current)) {
      errors.endDate.addError(messages.endServiceDate);
    }

    // Validate end date is after September 11, 2001 (accepts 2001-XX and 2001-09)
    if (
      (end.year && end.year < 2001) ||
      (end.year === 2001 && end.month && end.month < 9)
    ) {
      errors.endDate.addError(messages.endDate2001);
    }
  }
}

/**
 * Validate month/year dates for general toxic exposure
 * Supports year-only (YYYY-XX) or year+month (YYYY-MM)
 */
export function validateToxicExposureDates(errors, { startDate, endDate }) {
  // Individual date formats are validated by validateApproximateMonthYearDate in uiSchema

  const current = getCurrentDateComponents();

  // Validate date range
  if (startDate && endDate) {
    const start = parseDateComponents(startDate);
    const end = parseDateComponents(endDate);

    if (isStartAfterEnd(start, end)) {
      errors.startDate.addError(messages.invalidRange);
      return;
    }
  }

  // Validate dates are not in the future
  if (startDate) {
    const start = parseDateComponents(startDate);
    if (isFutureDate(start, current)) {
      errors.startDate.addError(messages.startServiceDate);
    }
  }

  if (endDate) {
    const end = parseDateComponents(endDate);
    if (isFutureDate(end, current)) {
      errors.endDate.addError(messages.endServiceDate);
    }
  }
}
