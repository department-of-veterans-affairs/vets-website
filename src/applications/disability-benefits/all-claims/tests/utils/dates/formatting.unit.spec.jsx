import { expect } from 'chai';
import sinon from 'sinon';
import { format } from 'date-fns';

import {
  formatDate,
  formatDateRange,
  formatMonthYearDate,
  formatDateShort,
  formatDateLong,
  isValidFullDate,
  isValidYear,
  validateAge,
  validateSeparationDate,
  validateServicePeriod,
  isLessThan180DaysInFuture,
  isWithinRange,
  isWithinServicePeriod,
  parseDate,
  parseDateWithTemplate,
  isBddClaimValid,
  getBddSeparationDateError,
  isMonthOnly,
  isYearOnly,
  isYearMonth,
  findEarliestServiceDate,
  isTreatmentBeforeService,
  daysFromToday,
  MIN_VALID_YEAR,
  MAX_VALID_YEAR,
  DATE_FORMAT_SHORT,
  DATE_TEMPLATE,
} from '../../../utils/dates/formatting';

describe('Disability benefits 526EZ -- Date formatting utilities', () => {
  describe('formatDate', () => {
    it('should format valid dates with default format', () => {
      expect(formatDate('2023-01-15')).to.equal('January 15, 2023');
      expect(formatDate('2023-12-31')).to.equal('December 31, 2023');
    });

    it('should format dates with custom format', () => {
      expect(formatDate('2023-01-15', DATE_FORMAT_SHORT)).to.equal(
        '01/15/2023',
      );
      expect(formatDate('2023-01-15', DATE_TEMPLATE)).to.equal('2023-01-15');
    });

    it('should return Unknown for invalid dates', () => {
      expect(formatDate(null)).to.equal('Unknown');
      expect(formatDate('')).to.equal('Unknown');
      expect(formatDate('invalid')).to.equal('Unknown');
    });
  });

  describe('formatDateRange', () => {
    it('should format valid date ranges', () => {
      const range = { from: '2023-01-01', to: '2023-12-31' };
      expect(formatDateRange(range)).to.equal(
        'January 1, 2023 to December 31, 2023',
      );
    });

    it('should format with custom format', () => {
      const range = { from: '2023-01-01', to: '2023-12-31' };
      expect(formatDateRange(range, DATE_FORMAT_SHORT)).to.equal(
        '01/01/2023 to 12/31/2023',
      );
    });

    it('should handle missing dates', () => {
      expect(formatDateRange({})).to.equal('Unknown');
      expect(formatDateRange({ from: '2023-01-01' })).to.equal(
        'January 1, 2023 to Unknown',
      );
      expect(formatDateRange({ to: '2023-12-31' })).to.equal(
        'Unknown to December 31, 2023',
      );
    });

    it('should handle null/undefined', () => {
      expect(formatDateRange(null)).to.equal('Unknown');
      expect(formatDateRange(undefined)).to.equal('Unknown');
    });
  });

  describe('formatMonthYearDate', () => {
    it('should format valid dates as month and year', () => {
      expect(formatMonthYearDate('2023-01-15')).to.equal('January 2023');
      expect(formatMonthYearDate('2023-12-31')).to.equal('December 2023');
    });

    it('should return empty string for invalid dates', () => {
      expect(formatMonthYearDate('')).to.equal('');
      expect(formatMonthYearDate(null)).to.equal('');
      expect(formatMonthYearDate('invalid')).to.equal('');
    });
  });

  describe('formatDateShort', () => {
    it('should format dates in MM/DD/YYYY format', () => {
      expect(formatDateShort('2023-01-15')).to.equal('01/15/2023');
      expect(formatDateShort('2023-12-31')).to.equal('12/31/2023');
    });
  });

  describe('formatDateLong', () => {
    it('should format dates in long format', () => {
      expect(formatDateLong('2023-01-15')).to.equal('January 15, 2023');
      expect(formatDateLong('2023-12-31')).to.equal('December 31, 2023');
    });
  });

  describe('isValidFullDate', () => {
    it('should validate correct YYYY-MM-DD format', () => {
      expect(isValidFullDate('2023-01-15')).to.be.true;
      expect(isValidFullDate('2023-12-31')).to.be.true;
      expect(isValidFullDate(`${MIN_VALID_YEAR}-01-01`)).to.be.true;
      expect(isValidFullDate(`${MAX_VALID_YEAR}-12-31`)).to.be.true;
    });

    it('should reject invalid formats', () => {
      expect(isValidFullDate('01/15/2023')).to.be.false;
      expect(isValidFullDate('2023-1-15')).to.be.false;
      expect(isValidFullDate('2023-01-5')).to.be.false;
      expect(isValidFullDate('23-01-15')).to.be.false;
    });

    it('should reject invalid dates', () => {
      expect(isValidFullDate('2023-13-01')).to.be.false;
      expect(isValidFullDate('2023-01-32')).to.be.false;
      expect(isValidFullDate('2023-02-30')).to.be.false;
    });

    it('should reject years outside valid range', () => {
      expect(isValidFullDate(`${MIN_VALID_YEAR - 1}-01-01`)).to.be.false;
      expect(isValidFullDate(`${MAX_VALID_YEAR + 1}-01-01`)).to.be.false;
    });

    it('should handle null/undefined', () => {
      expect(isValidFullDate(null)).to.be.false;
      expect(isValidFullDate(undefined)).to.be.false;
      expect(isValidFullDate('')).to.be.false;
    });
  });

  describe('isValidYear', () => {
    it('should accept valid years', () => {
      const err1 = { addError: sinon.spy() };
      isValidYear(err1, '2023');
      expect(err1.addError.called).to.be.false;

      const err2 = { addError: sinon.spy() };
      isValidYear(err2, MIN_VALID_YEAR.toString());
      expect(err2.addError.called).to.be.false;

      // Test a year that's likely within platform's range
      const err3 = { addError: sinon.spy() };
      isValidYear(err3, '2050');
      expect(err3.addError.called).to.be.false;
    });

    it('should reject invalid year formats', () => {
      const err = { addError: sinon.spy() };
      isValidYear(err, '23');
      expect(err.addError.called).to.be.true;
      expect(err.addError.firstCall.args[0]).to.include('valid year');
    });

    it('should reject years outside valid range', () => {
      const err = { addError: sinon.spy() };
      isValidYear(err, (MIN_VALID_YEAR - 1).toString());
      expect(err.addError.called).to.be.true;

      // Test with a year that's definitely outside any reasonable range
      const err2 = { addError: sinon.spy() };
      isValidYear(err2, '2200');
      expect(err2.addError.called).to.be.true;
    });
  });

  // isValidPartialDate function has been removed - partial date validation
  // is now handled by validateApproximateDate in validations.js

  describe('validateAge', () => {
    it('should add error if date is before 13th birthday', () => {
      const err = { addError: sinon.spy() };
      const formData = { veteranDateOfBirth: '2000-01-01' };
      validateAge(err, '2012-12-31', formData);
      expect(err.addError.called).to.be.true;
      expect(err.addError.firstCall.args[0]).to.include('13th birthday');
    });

    it('should not add error if date is after 13th birthday', () => {
      const err = { addError: sinon.spy() };
      const formData = { veteranDateOfBirth: '2000-01-01' };
      validateAge(err, '2013-01-02', formData);
      expect(err.addError.called).to.be.false;
    });

    it('should handle missing data', () => {
      const err = { addError: sinon.spy() };
      validateAge(err, '2023-01-01', {});
      expect(err.addError.called).to.be.false;

      validateAge(err, null, { veteranDateOfBirth: '2000-01-01' });
      expect(err.addError.called).to.be.false;
    });
  });

  describe('validateSeparationDate', () => {
    it('should add error if separation date is before service start', () => {
      const err = { addError: sinon.spy() };
      const formData = {
        serviceInformation: {
          servicePeriods: [
            { dateRange: { from: '2020-01-01' } },
            { dateRange: { from: '2022-01-01' } },
          ],
        },
      };
      validateSeparationDate(err, '2019-12-31', formData);
      expect(err.addError.called).to.be.true;
      expect(err.addError.firstCall.args[0]).to.include(
        'after service start date',
      );
    });

    it('should not add error for valid separation dates', () => {
      const err = { addError: sinon.spy() };
      const formData = {
        serviceInformation: {
          servicePeriods: [{ dateRange: { from: '2020-01-01' } }],
        },
      };
      validateSeparationDate(err, '2021-01-01', formData);
      expect(err.addError.called).to.be.false;
    });

    it('should handle missing data', () => {
      const err = { addError: sinon.spy() };
      validateSeparationDate(err, null, {});
      expect(err.addError.called).to.be.false;
    });
  });

  describe('validateServicePeriod', () => {
    it('should add error for missing dates', () => {
      const errors = { addError: sinon.spy() };
      validateServicePeriod(errors, {});
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include(
        'both start and end',
      );
    });

    it('should add error if end date is before start date', () => {
      const errors = { addError: sinon.spy() };
      validateServicePeriod(errors, {
        from: '2023-06-01',
        to: '2023-01-01',
      });
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include(
        'End date must be after start date',
      );
    });

    it('should not add error for valid periods', () => {
      const errors = { addError: sinon.spy() };
      validateServicePeriod(errors, {
        from: '2023-01-01',
        to: '2023-06-01',
      });
      expect(errors.addError.called).to.be.false;
    });
  });

  describe('isLessThan180DaysInFuture', () => {
    it('should add error for past dates', () => {
      const errors = { addError: sinon.spy() };
      const yesterday = daysFromToday(-1);
      isLessThan180DaysInFuture(errors, yesterday);
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include('future separation');
    });

    it('should add error for dates more than 180 days in future', () => {
      const errors = { addError: sinon.spy() };
      const futureDate = daysFromToday(181);
      isLessThan180DaysInFuture(errors, futureDate);
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include(
        'less than 180 days',
      );
    });

    it('should not add error for valid future dates', () => {
      const errors = { addError: sinon.spy() };
      const futureDate = daysFromToday(90);
      isLessThan180DaysInFuture(errors, futureDate);
      expect(errors.addError.called).to.be.false;
    });

    it('should add error for invalid dates', () => {
      const errors = { addError: sinon.spy() };
      isLessThan180DaysInFuture(errors, 'invalid');
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include('valid date');
    });
  });

  describe('isWithinRange', () => {
    const range = { from: '2023-01-01', to: '2023-12-31' };

    it('should return true for dates within range', () => {
      expect(isWithinRange('2023-06-15', range)).to.be.true;
      expect(isWithinRange('2023-01-01', range)).to.be.true;
      expect(isWithinRange('2023-12-31', range)).to.be.true;
    });

    it('should return false for dates outside range', () => {
      expect(isWithinRange('2022-12-31', range)).to.be.false;
      expect(isWithinRange('2024-01-01', range)).to.be.false;
    });

    it('should handle array of dates', () => {
      const dates = ['2023-03-01', '2023-06-15', '2023-09-01'];
      expect(isWithinRange(dates, range)).to.be.true;

      const datesWithOutside = ['2023-03-01', '2024-01-01'];
      expect(isWithinRange(datesWithOutside, range)).to.be.false;
    });

    it('should handle invalid inputs', () => {
      expect(isWithinRange(null, range)).to.be.false;
      expect(isWithinRange('2023-06-15', null)).to.be.false;
      expect(isWithinRange('2023-06-15', {})).to.be.false;
    });
  });

  describe('isWithinServicePeriod', () => {
    const servicePeriods = [
      { dateRange: { from: '2020-01-01', to: '2021-12-31' } },
      { dateRange: { from: '2023-01-01', to: '2023-12-31' } },
    ];

    it('should return true for dates within any service period', () => {
      expect(isWithinServicePeriod('2020-06-15', servicePeriods)).to.be.true;
      expect(isWithinServicePeriod('2023-06-15', servicePeriods)).to.be.true;
    });

    it('should return false for dates outside all service periods', () => {
      expect(isWithinServicePeriod('2022-06-15', servicePeriods)).to.be.false;
      expect(isWithinServicePeriod('2024-01-01', servicePeriods)).to.be.false;
    });

    it('should handle invalid inputs', () => {
      expect(isWithinServicePeriod(null, servicePeriods)).to.be.false;
      expect(isWithinServicePeriod('2023-06-15', [])).to.be.false;
      expect(isWithinServicePeriod('2023-06-15', null)).to.be.false;
    });
  });

  describe('parseDate', () => {
    it('should parse valid date strings', () => {
      const parsed = parseDate('2023-01-15');
      expect(parsed).to.not.be.null;
      expect(format(parsed, DATE_TEMPLATE)).to.equal('2023-01-15');
    });

    it('should parse with format', () => {
      const parsed = parseDate('01/15/2023', DATE_FORMAT_SHORT);
      expect(parsed).to.not.be.null;
      expect(format(parsed, DATE_TEMPLATE)).to.equal('2023-01-15');
    });

    it('should return null for invalid dates', () => {
      expect(parseDate(null)).to.be.null;
      expect(parseDate('invalid')).to.be.null;
    });
  });

  describe('parseDateWithTemplate', () => {
    it('should parse dates with YYYY-MM-DD template', () => {
      const parsed = parseDateWithTemplate('2023-01-15');
      expect(parsed).to.not.be.null;
      expect(format(parsed, DATE_TEMPLATE)).to.equal('2023-01-15');
    });

    it('should return null for invalid format', () => {
      expect(parseDateWithTemplate('01/15/2023')).to.be.null;
    });
  });

  describe('isBddClaimValid', () => {
    it('should return true for dates 90-180 days in future', () => {
      const date90Days = daysFromToday(90);
      const date180Days = daysFromToday(180);
      const date120Days = daysFromToday(120);

      expect(isBddClaimValid(date90Days)).to.be.true;
      expect(isBddClaimValid(date180Days)).to.be.true;
      expect(isBddClaimValid(date120Days)).to.be.true;
    });

    it('should return false for dates outside 90-180 day range', () => {
      const date89Days = daysFromToday(89);
      const date181Days = daysFromToday(181);
      const pastDate = daysFromToday(-1);

      expect(isBddClaimValid(date89Days)).to.be.false;
      expect(isBddClaimValid(date181Days)).to.be.false;
      expect(isBddClaimValid(pastDate)).to.be.false;
    });

    it('should handle invalid dates', () => {
      expect(isBddClaimValid(null)).to.be.false;
      expect(isBddClaimValid('invalid')).to.be.false;
    });
  });

  describe('getBddSeparationDateError', () => {
    it('should return error for dates less than 90 days', () => {
      const date89Days = daysFromToday(89);
      const error = getBddSeparationDateError(date89Days);
      expect(error).to.include('at least 90 days');
    });

    it('should return error for dates more than 180 days', () => {
      const date181Days = daysFromToday(181);
      const error = getBddSeparationDateError(date181Days);
      expect(error).to.include('no more than 180 days');
    });

    it('should return null for valid dates', () => {
      const date120Days = daysFromToday(120);
      expect(getBddSeparationDateError(date120Days)).to.be.null;
    });

    it('should return error for invalid dates', () => {
      expect(getBddSeparationDateError('invalid')).to.include(
        'valid separation date',
      );
    });
  });

  describe('isMonthOnly', () => {
    it('should identify month-only format', () => {
      expect(isMonthOnly('XXXX-01-XX')).to.be.true;
      expect(isMonthOnly('XXXX-12-XX')).to.be.true;
    });

    it('should reject other formats', () => {
      expect(isMonthOnly('2023-01-XX')).to.be.false;
      expect(isMonthOnly('XXXX-01-15')).to.be.false;
      expect(isMonthOnly('2023-01-15')).to.be.false;
    });
  });

  describe('isYearOnly', () => {
    it('should identify year-only format', () => {
      expect(isYearOnly('2023-XX-XX')).to.be.true;
      expect(isYearOnly('1999-XX-XX')).to.be.true;
    });

    it('should reject other formats', () => {
      expect(isYearOnly('XXXX-01-XX')).to.be.false;
      expect(isYearOnly('2023-01-XX')).to.be.false;
      expect(isYearOnly('2023-01-15')).to.be.false;
    });
  });

  describe('isYearMonth', () => {
    it('should identify year-month format', () => {
      expect(isYearMonth('2023-01-XX')).to.be.true;
      expect(isYearMonth('1999-12-XX')).to.be.true;
    });

    it('should reject other formats', () => {
      expect(isYearMonth('XXXX-01-XX')).to.be.false;
      expect(isYearMonth('2023-XX-XX')).to.be.false;
      expect(isYearMonth('2023-01-15')).to.be.false;
    });
  });

  describe('findEarliestServiceDate', () => {
    it('should find earliest date from valid service periods', () => {
      const servicePeriods = [
        { serviceBranch: 'Army', dateRange: { from: '2005-01-01' } },
        { serviceBranch: 'Navy', dateRange: { from: '2003-01-01' } },
        { serviceBranch: 'Marines', dateRange: { from: '2007-01-01' } },
      ];
      const earliest = findEarliestServiceDate(servicePeriods);
      expect(format(earliest, DATE_TEMPLATE)).to.equal('2003-01-01');
    });

    it('should filter out invalid periods', () => {
      const servicePeriods = [
        { serviceBranch: 'Army', dateRange: { from: '2005-01-01' } },
        { serviceBranch: '', dateRange: { from: '2001-01-01' } }, // Invalid
        { dateRange: { from: '2003-01-01' } }, // No branch
        { serviceBranch: 'Navy' }, // No dateRange
      ];
      const earliest = findEarliestServiceDate(servicePeriods);
      expect(format(earliest, DATE_TEMPLATE)).to.equal('2005-01-01');
    });

    it('should handle empty or invalid input', () => {
      expect(findEarliestServiceDate([])).to.be.null;
      expect(findEarliestServiceDate(null)).to.be.null;
      expect(findEarliestServiceDate('not-an-array')).to.be.null;
    });
  });

  describe('isTreatmentBeforeService', () => {
    const treatmentDate = new Date('2020-01-01');
    const serviceDate = new Date('2021-01-01');

    it('should check year-only comparisons', () => {
      expect(isTreatmentBeforeService(treatmentDate, serviceDate, '2020-XX-XX'))
        .to.be.true;
      expect(isTreatmentBeforeService(serviceDate, treatmentDate, '2021-XX-XX'))
        .to.be.false;
    });

    it('should check year-month comparisons', () => {
      expect(isTreatmentBeforeService(treatmentDate, serviceDate, '2020-01-XX'))
        .to.be.true;
      expect(isTreatmentBeforeService(serviceDate, treatmentDate, '2021-01-XX'))
        .to.be.false;
    });

    it('should return false for other formats', () => {
      expect(isTreatmentBeforeService(treatmentDate, serviceDate, '2020-01-01'))
        .to.be.false;
      expect(isTreatmentBeforeService(treatmentDate, serviceDate, 'XXXX-01-XX'))
        .to.be.false;
    });
  });
});
