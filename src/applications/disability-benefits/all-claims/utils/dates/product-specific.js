import {
  format,
  parse,
  parseISO,
  isValid,
  isBefore,
  isAfter,
  isSameMonth,
  sub,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from 'date-fns';

import {
  DATE_FULL_MONTH_YEAR_FORMAT,
  DATE_SHORT_MONTH_DAY_YEAR_FORMAT,
  DATE_SHORT_MONTH_YEAR_FORMAT,
} from './formatting';

/**
 * Product-specific date utilities for one-off functionality
 * These are date operations that are unique to specific features or products
 * within the disability-benefits/all-claims application
 */

/**
 * Internal utility to safely create date-fns objects
 * @private
 */
const safeFnsDate = date => {
  if (!date) return null;
  // Check if the date string contains only non-date characters to avoid parsing errors
  if (typeof date === 'string' && !/\d/.test(date)) {
    return null;
  }

  // Handle Date objects
  if (date instanceof Date) {
    return isValid(date) ? date : null;
  }

  // Try parsing as ISO string first (only if it looks like ISO format)
  let parsedDate = null;
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(date)) {
    parsedDate = parseISO(date);
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }

  // Try common date formats with a consistent reference date
  const referenceDate = new Date();
  const formats = ['MM/dd/yyyy', 'yyyy-MM-dd', 'MM-dd-yyyy'];
  for (const dateFormat of formats) {
    parsedDate = parse(date, dateFormat, referenceDate);
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }

  return null;
};

/**
 * Container for product-specific date operations
 */
export const productSpecificDates = {
  /**
   * PTSD-specific date validations
   */
  ptsd: {
    /**
     * Validate incident date for PTSD claims
     * Must be during service period and not in the future
     * @param {Object} errors - Errors object
     * @param {string} incidentDate - Date of incident
     * @param {Array} servicePeriods - Array of service periods
     */
    validateIncidentDate: (errors, incidentDate, servicePeriods = []) => {
      const date = safeFnsDate(incidentDate);
      if (!date) {
        errors.addError('Please provide a valid incident date');
        return;
      }

      // Check if in future
      if (isAfter(date, new Date())) {
        errors.addError('Incident date cannot be in the future');
        return;
      }

      // Check if within service periods
      const inService = servicePeriods.some(period => {
        const start = safeFnsDate(period.dateRange?.from);
        const end = safeFnsDate(period.dateRange?.to);
        return start && end && !isBefore(date, start) && !isAfter(date, end);
      });

      if (!inService && servicePeriods.length > 0) {
        errors.addError('Incident date must be within a service period');
      }
    },

    /**
     * Format incident date range for display
     * @param {Object} incident - Incident object with date information
     * @returns {string} Formatted date or date range
     */
    formatIncidentDateRange: incident => {
      if (!incident) return 'Unknown';

      const { incidentDate, incidentDateRange } = incident;

      // Single date
      if (incidentDate) {
        const date = safeFnsDate(incidentDate);
        return date ? format(date, DATE_FULL_MONTH_YEAR_FORMAT) : 'Unknown';
      }

      // Date range
      if (incidentDateRange?.from || incidentDateRange?.to) {
        const from = safeFnsDate(incidentDateRange.from);
        const to = safeFnsDate(incidentDateRange.to);

        if (from && to) {
          return `${format(from, DATE_FULL_MONTH_YEAR_FORMAT)} to ${format(
            to,
            DATE_FULL_MONTH_YEAR_FORMAT,
          )}`;
        }
        if (from) {
          return `From ${format(from, DATE_FULL_MONTH_YEAR_FORMAT)}`;
        }
        if (to) {
          return `Until ${format(to, DATE_FULL_MONTH_YEAR_FORMAT)}`;
        }
      }

      return 'Unknown';
    },
  },

  /**
   * Toxic exposure specific date operations
   */
  toxicExposure: {
    /**
     * Validate Gulf War service dates
     * @param {Object} errors - Errors object
     * @param {Object} dateRange - Service date range
     * @param {string} warPeriod - '1990' or '2001'
     */
    validateGulfWarDates: (errors, dateRange, warPeriod) => {
      const { from, to } = dateRange || {};
      const fromDate = safeFnsDate(from);
      const toDate = safeFnsDate(to);

      if (!fromDate || !toDate) {
        errors.addError('Please provide valid service dates');
        return;
      }

      // Gulf War 1990-1991 period
      if (warPeriod === '1990') {
        const warStart = new Date('1990-08-02');
        const warEnd = new Date('1991-07-31');

        const overlaps =
          !isAfter(fromDate, warEnd) && !isBefore(toDate, warStart);

        if (!overlaps) {
          errors.addError(
            'Service dates must overlap with Gulf War period (Aug 2, 1990 - Jul 31, 1991)',
          );
        }
      }

      // Post 9/11 period
      if (warPeriod === '2001') {
        const warStart = new Date('2001-09-11');

        if (isBefore(toDate, warStart)) {
          errors.addError(
            'Service dates must be on or after September 11, 2001',
          );
        }
      }
    },

    /**
     * Format exposure date range with specific rules
     * @param {Object} exposure - Exposure object
     * @returns {string} Formatted exposure period
     */
    formatExposurePeriod: exposure => {
      const { startDate, endDate, ongoing } = exposure || {};

      const start = safeFnsDate(startDate);
      if (!start) return 'Unknown period';

      const startFormatted = format(start, DATE_SHORT_MONTH_YEAR_FORMAT);
      if (ongoing) {
        return `${startFormatted} - Present`;
      }

      const end = safeFnsDate(endDate);
      if (!end) {
        return `Since ${startFormatted}`;
      }

      return `${startFormatted} - ${format(end, DATE_SHORT_MONTH_YEAR_FORMAT)}`;
    },
  },

  /**
   * Unemployability specific date operations
   */
  unemployability: {
    /**
     * Validate date became too disabled to work
     * @param {Object} errors - Errors object
     * @param {string} disabilityDate - Date became disabled
     * @param {string} lastWorkedDate - Last date worked
     */
    validateDisabilityDate: (errors, disabilityDate, lastWorkedDate) => {
      const disabledDate = safeFnsDate(disabilityDate);
      const lastWorked = safeFnsDate(lastWorkedDate);

      if (!disabledDate) {
        errors.addError(
          'Please provide the date you became too disabled to work',
        );
        return;
      }

      // Cannot be in future
      if (isAfter(disabledDate, new Date())) {
        errors.addError('Date cannot be in the future');
        return;
      }

      // Should be after last worked date if provided
      if (lastWorked && isBefore(disabledDate, lastWorked)) {
        errors.addError(
          'Date you became disabled must be after the last date you worked',
        );
      }
    },

    /**
     * Calculate months of unemployment
     * @param {string} lastWorkedDate - Last date worked
     * @returns {number} Number of months unemployed
     */
    calculateUnemploymentDuration: lastWorkedDate => {
      const lastWorked = safeFnsDate(lastWorkedDate);
      if (!lastWorked) return 0;

      return differenceInMonths(new Date(), lastWorked);
    },
  },

  /**
   * Hospitalization specific date operations
   */
  hospitalization: {
    /**
     * Validate hospitalization dates with specific rules
     * @param {Object} errors - Errors object
     * @param {Object} hospitalization - Hospitalization object
     */
    validateHospitalizationDates: (errors, hospitalization) => {
      const { from, to } = hospitalization || {};
      const fromDate = safeFnsDate(from);
      const toDate = safeFnsDate(to);

      if (!fromDate) {
        errors.addError('Please provide admission date');
        return;
      }

      // Admission cannot be in future
      if (isAfter(fromDate, new Date())) {
        errors.addError('Admission date cannot be in the future');
        return;
      }

      // If discharged, validate discharge date
      if (to && toDate) {
        if (isBefore(toDate, fromDate)) {
          errors.addError('Discharge date must be after admission date');
          return;
        }

        // Check for unreasonably long stays (> 2 years)
        const stayDuration = differenceInYears(toDate, fromDate);
        if (stayDuration > 2) {
          errors.addError(
            'Please verify the dates. Hospitalization appears to be longer than 2 years.',
          );
        }
      }
    },

    /**
     * Format hospitalization period
     * @param {Object} hospitalization - Hospitalization object
     * @returns {string} Formatted period
     */
    formatHospitalizationPeriod: hospitalization => {
      const { from, to } = hospitalization || {};
      const fromDate = safeFnsDate(from);

      if (!fromDate) return 'Unknown';

      const fromFormatted = format(fromDate, DATE_SHORT_MONTH_DAY_YEAR_FORMAT);
      if (!to) {
        return `Admitted ${fromFormatted} (ongoing)`;
      }

      const toDate = safeFnsDate(to);
      if (!toDate) return fromFormatted;

      const days = differenceInDays(toDate, fromDate) + 1;
      return `${fromFormatted} - ${format(
        toDate,
        'MMM d, yyyy',
      )} (${days} days)`;
    },
  },

  /**
   * Evidence/document specific date operations
   */
  evidence: {
    /**
     * Check if evidence date is within acceptable range
     * @param {string} evidenceDate - Date of evidence
     * @param {number} maxYears - Maximum years old evidence can be
     * @returns {boolean} True if within range
     */
    isEvidenceDateAcceptable: (evidenceDate, maxYears = 5) => {
      const date = safeFnsDate(evidenceDate);
      if (!date) return false;

      const cutoffDate = sub(new Date(), { years: maxYears });
      return isAfter(date, cutoffDate);
    },

    /**
     * Format treatment date range
     * @param {Object} treatment - Treatment object
     * @returns {string} Formatted treatment period
     */
    formatTreatmentPeriod: treatment => {
      const { from, to, ongoing } = treatment || {};
      const fromDate = safeFnsDate(from);

      if (!fromDate) return 'Date unknown';

      if (ongoing || !to) {
        return `Since ${format(fromDate, DATE_FULL_MONTH_YEAR_FORMAT)}`;
      }

      const toDate = safeFnsDate(to);
      if (!toDate) return format(fromDate, DATE_FULL_MONTH_YEAR_FORMAT);
      // Same month/year
      if (isSameMonth(fromDate, toDate)) {
        return format(fromDate, DATE_FULL_MONTH_YEAR_FORMAT);
      }

      return `${format(fromDate, DATE_SHORT_MONTH_YEAR_FORMAT)} - ${format(
        toDate,
        DATE_SHORT_MONTH_YEAR_FORMAT,
      )}`;
    },
  },
};
