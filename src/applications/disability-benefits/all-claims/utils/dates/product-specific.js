/**
 * TODO: tech-debt(you-dont-need-momentjs): Waiting for Node upgrade to support Temporal API
 * @see https://github.com/department-of-veterans-affairs/va.gov-team/issues/110024
 */
/* eslint-disable you-dont-need-momentjs/no-import-moment */
/* eslint-disable you-dont-need-momentjs/no-moment-constructor */
/* eslint-disable you-dont-need-momentjs/diff */
/* eslint-disable you-dont-need-momentjs/subtract */
import moment from 'moment';

/**
 * Product-specific date utilities for one-off functionality
 * These are date operations that are unique to specific features or products
 * within the disability-benefits/all-claims application
 */

/**
 * Internal utility to safely create moment objects
 * @private
 */
const safeMoment = date => {
  if (!date) return null;
  const momentDate = moment(date);
  return momentDate.isValid() ? momentDate : null;
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
      const date = safeMoment(incidentDate);
      if (!date) {
        errors.addError('Please provide a valid incident date');
        return;
      }

      // Check if in future
      if (date.isAfter(moment())) {
        errors.addError('Incident date cannot be in the future');
        return;
      }

      // Check if within service periods
      const inService = servicePeriods.some(period => {
        const start = safeMoment(period.dateRange?.from);
        const end = safeMoment(period.dateRange?.to);
        return (
          start &&
          end &&
          date.isSameOrAfter(start, 'day') &&
          date.isSameOrBefore(end, 'day')
        );
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
        const date = safeMoment(incidentDate);
        return date ? date.format('MMMM YYYY') : 'Unknown';
      }

      // Date range
      if (incidentDateRange?.from || incidentDateRange?.to) {
        const from = safeMoment(incidentDateRange.from);
        const to = safeMoment(incidentDateRange.to);

        if (from && to) {
          return `${from.format('MMMM YYYY')} to ${to.format('MMMM YYYY')}`;
        }
        if (from) {
          return `From ${from.format('MMMM YYYY')}`;
        }
        if (to) {
          return `Until ${to.format('MMMM YYYY')}`;
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
      const fromDate = safeMoment(from);
      const toDate = safeMoment(to);

      if (!fromDate || !toDate) {
        errors.addError('Please provide valid service dates');
        return;
      }

      // Gulf War 1990-1991 period
      if (warPeriod === '1990') {
        const warStart = moment('1990-08-02');
        const warEnd = moment('1991-07-31');

        const overlaps =
          fromDate.isSameOrBefore(warEnd) && toDate.isSameOrAfter(warStart);

        if (!overlaps) {
          errors.addError(
            'Service dates must overlap with Gulf War period (Aug 2, 1990 - Jul 31, 1991)',
          );
        }
      }

      // Post 9/11 period
      if (warPeriod === '2001') {
        const warStart = moment('2001-09-11');

        if (toDate.isBefore(warStart)) {
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

      const start = safeMoment(startDate);
      if (!start) return 'Unknown period';

      const startFormatted = start.format('MMM YYYY');

      if (ongoing) {
        return `${startFormatted} - Present`;
      }

      const end = safeMoment(endDate);
      if (!end) {
        return `Since ${startFormatted}`;
      }

      return `${startFormatted} - ${end.format('MMM YYYY')}`;
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
      const disabledDate = safeMoment(disabilityDate);
      const lastWorked = safeMoment(lastWorkedDate);

      if (!disabledDate) {
        errors.addError(
          'Please provide the date you became too disabled to work',
        );
        return;
      }

      // Cannot be in future
      if (disabledDate.isAfter(moment())) {
        errors.addError('Date cannot be in the future');
        return;
      }

      // Should be after last worked date if provided
      if (lastWorked && disabledDate.isBefore(lastWorked)) {
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
      const lastWorked = safeMoment(lastWorkedDate);
      if (!lastWorked) return 0;

      return moment().diff(lastWorked, 'months');
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
      const fromDate = safeMoment(from);
      const toDate = safeMoment(to);

      if (!fromDate) {
        errors.addError('Please provide admission date');
        return;
      }

      // Admission cannot be in future
      if (fromDate.isAfter(moment())) {
        errors.addError('Admission date cannot be in the future');
        return;
      }

      // If discharged, validate discharge date
      if (to && toDate) {
        if (toDate.isBefore(fromDate)) {
          errors.addError('Discharge date must be after admission date');
          return;
        }

        // Check for unreasonably long stays (> 2 years)
        const stayDuration = toDate.diff(fromDate, 'years', true);
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
      const fromDate = safeMoment(from);

      if (!fromDate) return 'Unknown';

      const fromFormatted = fromDate.format('MMM D, YYYY');

      if (!to) {
        return `Admitted ${fromFormatted} (ongoing)`;
      }

      const toDate = safeMoment(to);
      if (!toDate) return fromFormatted;

      const days = toDate.diff(fromDate, 'days') + 1;
      return `${fromFormatted} - ${toDate.format(
        'MMM D, YYYY',
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
      const date = safeMoment(evidenceDate);
      if (!date) return false;

      const cutoffDate = moment().subtract(maxYears, 'years');
      return date.isAfter(cutoffDate);
    },

    /**
     * Format treatment date range
     * @param {Object} treatment - Treatment object
     * @returns {string} Formatted treatment period
     */
    formatTreatmentPeriod: treatment => {
      const { from, to, ongoing } = treatment || {};
      const fromDate = safeMoment(from);

      if (!fromDate) return 'Date unknown';

      if (ongoing || !to) {
        return `Since ${fromDate.format('MMMM YYYY')}`;
      }

      const toDate = safeMoment(to);
      if (!toDate) return fromDate.format('MMMM YYYY');

      // Same month/year
      if (fromDate.isSame(toDate, 'month')) {
        return fromDate.format('MMMM YYYY');
      }

      return `${fromDate.format('MMM YYYY')} - ${toDate.format('MMM YYYY')}`;
    },
  },
};
