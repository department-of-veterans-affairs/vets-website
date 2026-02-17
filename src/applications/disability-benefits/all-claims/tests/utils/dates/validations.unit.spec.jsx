/**
 * TODO: tech-debt(you-dont-need-momentjs): Waiting for Node upgrade to support Temporal API
 * @see https://github.com/department-of-veterans-affairs/va.gov-team/issues/110024
 */
/* eslint-disable you-dont-need-momentjs/no-import-moment */
/* eslint-disable you-dont-need-momentjs/no-moment-constructor */
/* eslint-disable you-dont-need-momentjs/add */
/* eslint-disable you-dont-need-momentjs/format */

import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';

import {
  validateDateNotBeforeReference,
  validateSeparationDateWithRules,
  validateTitle10ActivationDate,
  validateApproximateDate,
  validateApproximateMonthYearDate,
} from '../../../utils/dates/validations';

describe('Disability benefits 526EZ -- Date validation utilities', () => {
  describe('validateDateNotBeforeReference', () => {
    it('should add error for invalid date to check', () => {
      const errors = { addError: sinon.spy() };
      validateDateNotBeforeReference(errors, 'invalid', '2023-01-01');
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include('valid date');
    });

    it('should add error for invalid reference date', () => {
      const errors = { addError: sinon.spy() };
      validateDateNotBeforeReference(errors, '2023-01-01', 'invalid');
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include(
        'Invalid reference date',
      );
    });

    it('should add error when date is before reference (inclusive)', () => {
      const errors = { addError: sinon.spy() };
      validateDateNotBeforeReference(errors, '2023-01-01', '2023-01-02');
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include(
        'Date must be on or after 01/02/2023',
      );
    });

    it('should not add error when date is same as reference (inclusive)', () => {
      const errors = { addError: sinon.spy() };
      validateDateNotBeforeReference(errors, '2023-01-01', '2023-01-01');
      expect(errors.addError.called).to.be.false;
    });

    it('should use custom message when provided', () => {
      const errors = { addError: sinon.spy() };
      validateDateNotBeforeReference(errors, '2023-01-01', '2023-01-02', {
        customMessage: 'Custom error message',
      });
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.equal(
        'Custom error message',
      );
    });
  });

  describe('validateSeparationDateWithRules', () => {
    it('should add error for invalid date', () => {
      const errors = { addError: sinon.spy() };
      validateSeparationDateWithRules(errors, 'invalid-date');
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include('not a real date');
    });

    describe('BDD claims', () => {
      it('should allow dates between 90-180 days for BDD', () => {
        const errors = { addError: sinon.spy() };
        const date120Days = moment().add(120, 'days').format('YYYY-MM-DD');
        validateSeparationDateWithRules(errors, date120Days, { isBDD: true });
        expect(errors.addError.called).to.be.false;
      });

      it('should add error for dates more than 180 days for BDD', () => {
        const errors = { addError: sinon.spy() };
        const date181Days = moment().add(181, 'days').format('YYYY-MM-DD');
        validateSeparationDateWithRules(errors, date181Days, { isBDD: true });
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'before 180 days from today',
        );
      });
    });

    describe('Non-BDD claims', () => {
      it('should add error for dates more than 180 days (non-BDD)', () => {
        const errors = { addError: sinon.spy() };
        const date181Days = moment().add(181, 'days').format('YYYY-MM-DD');
        validateSeparationDateWithRules(errors, date181Days);
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'more than 180 days from now',
        );
      });

      it('should add error for future dates when not reserves', () => {
        const errors = { addError: sinon.spy() };
        const date100Days = moment().add(100, 'days').format('YYYY-MM-DD');
        validateSeparationDateWithRules(errors, date100Days, {
          isReserves: false,
        });
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'must be in the past',
        );
      });

      it('should allow future dates for reserves (non-BDD)', () => {
        const errors = { addError: sinon.spy() };
        const date100Days = moment().add(100, 'days').format('YYYY-MM-DD');
        validateSeparationDateWithRules(errors, date100Days, {
          isReserves: true,
        });
        expect(errors.addError.called).to.be.false;
      });
    });
  });

  describe('validateTitle10ActivationDate', () => {
    const reservesList = ['Reserve', 'National Guard'];

    it('should add error for invalid activation date', () => {
      const errors = { addError: sinon.spy() };
      validateTitle10ActivationDate(errors, 'invalid', [], reservesList);
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include(
        'valid activation date',
      );
    });

    it('should add error for future activation date', () => {
      const errors = { addError: sinon.spy() };
      const tomorrow = moment().add(1, 'day').format('YYYY-MM-DD');
      validateTitle10ActivationDate(errors, tomorrow, [], reservesList);
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include(
        'activation date in the past',
      );
    });

    it('should not add error when no reserve/guard periods', () => {
      const errors = { addError: sinon.spy() };
      const servicePeriods = [
        { serviceBranch: 'Army', dateRange: { from: '2020-01-01' } },
        { serviceBranch: 'Navy', dateRange: { from: '2021-01-01' } },
      ];
      validateTitle10ActivationDate(
        errors,
        '2022-01-01',
        servicePeriods,
        reservesList,
      );
      expect(errors.addError.called).to.be.false;
    });

    it('should add error when activation is before earliest reserve/guard start', () => {
      const errors = { addError: sinon.spy() };
      const servicePeriods = [
        { serviceBranch: 'Army', dateRange: { from: '2018-01-01' } },
        { serviceBranch: 'Reserve', dateRange: { from: '2020-01-01' } },
        { serviceBranch: 'National Guard', dateRange: { from: '2021-01-01' } },
      ];
      validateTitle10ActivationDate(
        errors,
        '2019-12-31',
        servicePeriods,
        reservesList,
      );
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include(
        'after your earliest service start date',
      );
    });

    it('should not add error when activation is after earliest reserve/guard start', () => {
      const errors = { addError: sinon.spy() };
      const servicePeriods = [
        { serviceBranch: 'Reserve', dateRange: { from: '2020-01-01' } },
        { serviceBranch: 'National Guard', dateRange: { from: '2021-01-01' } },
      ];
      validateTitle10ActivationDate(
        errors,
        '2020-06-01',
        servicePeriods,
        reservesList,
      );
      expect(errors.addError.called).to.be.false;
    });

    it('should handle missing dateRange data', () => {
      const errors = { addError: sinon.spy() };
      const servicePeriods = [
        { serviceBranch: 'Reserve', dateRange: {} },
        { serviceBranch: 'National Guard' },
      ];
      validateTitle10ActivationDate(
        errors,
        '2020-06-01',
        servicePeriods,
        reservesList,
      );
      expect(errors.addError.called).to.be.false;
    });
  });

  describe('validateApproximateDate', () => {
    describe('with allowPartial=true (default)', () => {
      it('should accept year-only format', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, '2020-XX-XX');
        expect(errors.addError.called).to.be.false;
      });

      it('should accept year-month format', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, '2020-06-XX');
        expect(errors.addError.called).to.be.false;
      });

      it('should accept full date format', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, '2020-06-15');
        expect(errors.addError.called).to.be.false;
      });

      it('should reject month-only format (no year)', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, 'XXXX-06-XX');
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'a month and year',
        );
      });

      it('should reject day-only format', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, 'XXXX-XX-15');
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'a month and year',
        );
      });

      it('should reject month-day without year', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, 'XXXX-06-15');
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'a month and year',
        );
      });
    });

    describe('with allowPartial=false', () => {
      it('should reject year-only format', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, '2020-XX-XX', { allowPartial: false });
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'month, day, and year',
        );
      });

      it('should reject year-month format', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, '2020-06-XX', { allowPartial: false });
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'month, day, and year',
        );
      });

      it('should accept full date format', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, '2020-06-15', { allowPartial: false });
        expect(errors.addError.called).to.be.false;
      });
    });

    describe('year validation', () => {
      // Year range validation applies to individual date fields,
      // whether standalone dates or dates within a range (start/end dates)
      it('should reject year below minimum (default 1900)', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, '1899-XX-XX');
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include('between 1900');
      });

      it('should reject year above maximum (default current year)', () => {
        const errors = { addError: sinon.spy() };
        const nextYear = new Date().getFullYear() + 1;
        validateApproximateDate(errors, `${nextYear}-XX-XX`);
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include('between 1900');
      });

      it('should accept custom year range', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, '1950-XX-XX', {
          minYear: 1950,
          maxYear: 2000,
        });
        expect(errors.addError.called).to.be.false;
      });

      it('should reject year outside custom range', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, '2001-XX-XX', {
          minYear: 1950,
          maxYear: 2000,
        });
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'between 1950 and 2000',
        );
      });

      it('should reject non-integer year', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, 'abcd-XX-XX');
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'Please enter a year between',
        );
      });
    });

    describe('month validation', () => {
      it('should reject invalid month (0)', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, '2020-00-XX');
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include('valid month');
      });

      it('should reject invalid month (13)', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, '2020-13-XX');
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include('valid month');
      });

      it('should accept valid months (1-12)', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, '2020-01-XX');
        expect(errors.addError.called).to.be.false;

        const errors2 = { addError: sinon.spy() };
        validateApproximateDate(errors2, '2020-12-XX');
        expect(errors2.addError.called).to.be.false;
      });

      it('should reject non-integer month', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, '2020-ab-XX');
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include('valid month');
      });
    });

    describe('day validation', () => {
      it('should reject invalid day (0)', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, '2020-06-00');
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include('valid day');
      });

      it('should reject invalid day (32)', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, '2020-06-32');
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include('valid day');
      });

      it('should accept valid days (1-31)', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, '2020-01-01');
        expect(errors.addError.called).to.be.false;

        const errors2 = { addError: sinon.spy() };
        validateApproximateDate(errors2, '2020-01-31');
        expect(errors2.addError.called).to.be.false;
      });

      it('should reject non-integer day', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, '2020-06-ab');
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include('valid day');
      });

      it('should reject invalid date for month (February 30)', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, '2020-02-30');
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'valid date for the selected month',
        );
      });

      it('should reject invalid date for month (April 31)', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, '2020-04-31');
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'valid date for the selected month',
        );
      });

      it('should accept February 29 on leap year', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, '2020-02-29');
        expect(errors.addError.called).to.be.false;
      });

      it('should reject February 29 on non-leap year', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, '2021-02-29');
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'valid date for the selected month',
        );
      });
    });

    describe('future date validation', () => {
      it('should reject future dates', () => {
        const errors = { addError: sinon.spy() };
        const futureDate = moment().add(1, 'day').format('YYYY-MM-DD');
        validateApproximateDate(errors, futureDate);
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'not in the future',
        );
      });

      it('should accept past dates', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, '2020-06-15');
        expect(errors.addError.called).to.be.false;
      });

      it("should accept today's date", () => {
        const errors = { addError: sinon.spy() };
        const today = moment().format('YYYY-MM-DD');
        validateApproximateDate(errors, today);
        expect(errors.addError.called).to.be.false;
      });

      it('should not check future date for partial dates', () => {
        const errors = { addError: sinon.spy() };
        // Partial dates skip future date validation, but year must still be within min/max range
        // So we use current year (which passes year range validation)
        const currentYear = new Date().getFullYear();
        validateApproximateDate(errors, `${currentYear}-XX-XX`);
        expect(errors.addError.called).to.be.false;
      });
    });

    describe('edge cases', () => {
      it('should handle empty string', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, '');
        expect(errors.addError.called).to.be.false;
      });

      it('should handle null', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, null);
        expect(errors.addError.called).to.be.false;
      });

      it('should handle undefined', () => {
        const errors = { addError: sinon.spy() };
        validateApproximateDate(errors, undefined);
        expect(errors.addError.called).to.be.false;
      });
    });
  });

  describe('validateApproximateMonthYearDate', () => {
    const currentYear = new Date().getFullYear();

    it('should accept empty date (field is optional)', () => {
      const errors = { addError: sinon.spy() };
      validateApproximateMonthYearDate(errors, '');
      expect(errors.addError.called).to.be.false;
    });

    it('should accept null date (field is optional)', () => {
      const errors = { addError: sinon.spy() };
      validateApproximateMonthYearDate(errors, null);
      expect(errors.addError.called).to.be.false;
    });

    it('should accept undefined date (field is optional)', () => {
      const errors = { addError: sinon.spy() };
      validateApproximateMonthYearDate(errors, undefined);
      expect(errors.addError.called).to.be.false;
    });

    it('should accept year-only format (YYYY-XX)', () => {
      const errors = { addError: sinon.spy() };
      validateApproximateMonthYearDate(errors, '2020-XX');
      expect(errors.addError.called).to.be.false;
    });

    it('should accept year-month format (YYYY-MM)', () => {
      const errors = { addError: sinon.spy() };
      validateApproximateMonthYearDate(errors, '2020-06');
      expect(errors.addError.called).to.be.false;
    });

    it('should reject month-only format (XXXX-MM)', () => {
      const errors = { addError: sinon.spy() };
      validateApproximateMonthYearDate(errors, 'XXXX-06');
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.equal(
        'You must enter a year if you select a month',
      );
    });

    it('should reject invalid year range (too old)', () => {
      const errors = { addError: sinon.spy() };
      validateApproximateMonthYearDate(errors, '1899-XX');
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include('1900');
      expect(errors.addError.firstCall.args[0]).to.include(
        currentYear.toString(),
      );
    });

    it('should reject invalid year range (too future)', () => {
      const errors = { addError: sinon.spy() };
      const futureYear = currentYear + 1;
      validateApproximateMonthYearDate(errors, `${futureYear}-XX`);
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include('1900');
      expect(errors.addError.firstCall.args[0]).to.include(
        currentYear.toString(),
      );
    });

    it('should reject invalid month (0)', () => {
      const errors = { addError: sinon.spy() };
      validateApproximateMonthYearDate(errors, '2020-00');
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include('valid month');
    });

    it('should reject invalid month (13)', () => {
      const errors = { addError: sinon.spy() };
      validateApproximateMonthYearDate(errors, '2020-13');
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include('valid month');
    });

    it('should accept valid month range (1-12)', () => {
      const errors1 = { addError: sinon.spy() };
      validateApproximateMonthYearDate(errors1, '2020-01');
      expect(errors1.addError.called).to.be.false;

      const errors2 = { addError: sinon.spy() };
      validateApproximateMonthYearDate(errors2, '2020-12');
      expect(errors2.addError.called).to.be.false;
    });

    it('should accept current year', () => {
      const errors = { addError: sinon.spy() };
      validateApproximateMonthYearDate(errors, `${currentYear}-XX`);
      expect(errors.addError.called).to.be.false;
    });

    it('should accept year 1900', () => {
      const errors = { addError: sinon.spy() };
      validateApproximateMonthYearDate(errors, '1900-XX');
      expect(errors.addError.called).to.be.false;
    });

    it('should accept full date format (YYYY-MM-DD) for backward compatibility', () => {
      // The day portion is ignored, only year and month are validated
      const errors1 = { addError: sinon.spy() };
      validateApproximateMonthYearDate(errors1, '2000-05-15');
      expect(errors1.addError.called).to.be.false;

      const errors2 = { addError: sinon.spy() };
      validateApproximateMonthYearDate(errors2, '2020-12-31');
      expect(errors2.addError.called).to.be.false;
    });
  });
});
