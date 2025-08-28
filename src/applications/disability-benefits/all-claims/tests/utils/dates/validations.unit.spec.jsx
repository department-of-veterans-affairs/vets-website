/**
 * TODO: tech-debt(you-dont-need-momentjs): Waiting for Node upgrade to support Temporal API
 * @see https://github.com/department-of-veterans-affairs/va.gov-team/issues/110024
 */
/* eslint-disable you-dont-need-momentjs/no-import-moment */
/* eslint-disable you-dont-need-momentjs/no-moment-constructor */
/* eslint-disable you-dont-need-momentjs/add */
/* eslint-disable you-dont-need-momentjs/format */

import { expect } from 'chai';
import moment from 'moment';

import {
  validateDateFormats,
  validateDateNotBeforeReference,
  validateSeparationDateWithRules,
  validateTitle10ActivationDate,
} from '../../../utils/dates/validations';

// Helper function to create mock error objects
const createMockErrors = () => {
  const errors = [];
  return {
    addError: message => errors.push(message),
    getErrors: () => errors,
    hasErrors: () => errors.length > 0,
    getFirstError: () => errors[0],
  };
};

// Helper for creating mock errors with startDate and endDate
const createDateErrors = () => ({
  startDate: createMockErrors(),
  endDate: createMockErrors(),
});

describe('Disability benefits 526EZ -- Date validation utilities', () => {
  describe('validateDateNotBeforeReference', () => {
    it('should add error for invalid date to check', () => {
      const errors = createMockErrors();
      validateDateNotBeforeReference(errors, 'invalid', '2023-01-01');
      expect(errors.hasErrors()).to.be.true;
      expect(errors.getFirstError()).to.include('valid date');
    });

    it('should add error for invalid reference date', () => {
      const errors = createMockErrors();
      validateDateNotBeforeReference(errors, '2023-01-01', 'invalid');
      expect(errors.hasErrors()).to.be.true;
      expect(errors.getFirstError()).to.include('Invalid reference date');
    });

    it('should add error when date is before reference (inclusive)', () => {
      const errors = createMockErrors();
      validateDateNotBeforeReference(errors, '2023-01-01', '2023-01-02');
      expect(errors.hasErrors()).to.be.true;
      expect(errors.getFirstError()).to.include(
        'Date must be on or after 01/02/2023',
      );
    });

    it('should not add error when date is same as reference (inclusive)', () => {
      const errors = createMockErrors();
      validateDateNotBeforeReference(errors, '2023-01-01', '2023-01-01');
      expect(errors.hasErrors()).to.be.false;
    });

    it('should use custom message when provided', () => {
      const errors = createMockErrors();
      validateDateNotBeforeReference(errors, '2023-01-01', '2023-01-02', {
        customMessage: 'Custom error message',
      });
      expect(errors.hasErrors()).to.be.true;
      expect(errors.getFirstError()).to.equal('Custom error message');
    });
  });

  describe('validateSeparationDateWithRules', () => {
    it('should add error for invalid date', () => {
      const errors = createMockErrors();
      validateSeparationDateWithRules(errors, 'invalid-date');
      expect(errors.hasErrors()).to.be.true;
      expect(errors.getFirstError()).to.include('not a real date');
    });

    describe('BDD claims', () => {
      it('should allow dates between 90-180 days for BDD', () => {
        const errors = createMockErrors();
        const date120Days = moment()
          .add(120, 'days')
          .format('YYYY-MM-DD');
        validateSeparationDateWithRules(errors, date120Days, { isBDD: true });
        expect(errors.hasErrors()).to.be.false;
      });

      it('should add error for dates more than 180 days for BDD', () => {
        const errors = createMockErrors();
        const date181Days = moment()
          .add(181, 'days')
          .format('YYYY-MM-DD');
        validateSeparationDateWithRules(errors, date181Days, { isBDD: true });
        expect(errors.hasErrors()).to.be.true;
        expect(errors.getFirstError()).to.include('before 180 days from today');
      });
    });

    describe('Non-BDD claims', () => {
      it('should add error for dates more than 180 days (non-BDD)', () => {
        const errors = createMockErrors();
        const date181Days = moment()
          .add(181, 'days')
          .format('YYYY-MM-DD');
        validateSeparationDateWithRules(errors, date181Days);
        expect(errors.hasErrors()).to.be.true;
        expect(errors.getFirstError()).to.include(
          'more than 180 days from now',
        );
      });

      it('should add error for future dates when not reserves', () => {
        const errors = createMockErrors();
        const date100Days = moment()
          .add(100, 'days')
          .format('YYYY-MM-DD');
        validateSeparationDateWithRules(errors, date100Days, {
          isReserves: false,
        });
        expect(errors.hasErrors()).to.be.true;
        expect(errors.getFirstError()).to.include('must be in the past');
      });

      it('should allow future dates for reserves (non-BDD)', () => {
        const errors = createMockErrors();
        const date100Days = moment()
          .add(100, 'days')
          .format('YYYY-MM-DD');
        validateSeparationDateWithRules(errors, date100Days, {
          isReserves: true,
        });
        expect(errors.hasErrors()).to.be.false;
      });
    });
  });

  describe('validateTitle10ActivationDate', () => {
    const reservesList = ['Reserve', 'National Guard'];

    it('should add error for invalid activation date', () => {
      const errors = createMockErrors();
      validateTitle10ActivationDate(errors, 'invalid', [], reservesList);
      expect(errors.hasErrors()).to.be.true;
      expect(errors.getFirstError()).to.include('valid activation date');
    });

    it('should add error for future activation date', () => {
      const errors = createMockErrors();
      const tomorrow = moment()
        .add(1, 'day')
        .format('YYYY-MM-DD');
      validateTitle10ActivationDate(errors, tomorrow, [], reservesList);
      expect(errors.hasErrors()).to.be.true;
      expect(errors.getFirstError()).to.include('activation date in the past');
    });

    it('should not add error when no reserve/guard periods', () => {
      const errors = createMockErrors();
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
      expect(errors.hasErrors()).to.be.false;
    });

    it('should add error when activation is before earliest reserve/guard start', () => {
      const errors = createMockErrors();
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
      expect(errors.hasErrors()).to.be.true;
      expect(errors.getFirstError()).to.include(
        'after your earliest service start date',
      );
    });

    it('should not add error when activation is after earliest reserve/guard start', () => {
      const errors = createMockErrors();
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
      expect(errors.hasErrors()).to.be.false;
    });

    it('should handle missing dateRange data', () => {
      const errors = createMockErrors();
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
      expect(errors.hasErrors()).to.be.false;
    });
  });

  describe('validateDateFormats', () => {
    let errors;

    beforeEach(() => {
      errors = createDateErrors();
    });

    it('should not add errors for valid dates', () => {
      validateDateFormats(errors, '2023-01-01', '2023-12-31');

      expect(errors.startDate.hasErrors()).to.be.false;
      expect(errors.endDate.hasErrors()).to.be.false;
    });

    it('should add error for invalid start date format', () => {
      validateDateFormats(errors, 'not-a-date', '2023-12-31');

      expect(errors.startDate.hasErrors()).to.be.true;
      expect(errors.startDate.getFirstError()).to.include('Enter a valid date');
      expect(errors.endDate.hasErrors()).to.be.false;
    });

    it('should add error for invalid end date format', () => {
      validateDateFormats(errors, '2023-01-01', '31-12-2023');

      expect(errors.startDate.hasErrors()).to.be.false;
      expect(errors.endDate.hasErrors()).to.be.true;
      expect(errors.endDate.getFirstError()).to.include('Enter a valid date');
    });

    it('should add errors for both invalid dates', () => {
      validateDateFormats(errors, 'invalid', 'also-invalid');

      expect(errors.startDate.hasErrors()).to.be.true;
      expect(errors.endDate.hasErrors()).to.be.true;
    });

    it('should handle null dates without errors', () => {
      validateDateFormats(errors, null, null);

      expect(errors.startDate.hasErrors()).to.be.false;
      expect(errors.endDate.hasErrors()).to.be.false;
    });

    it('should handle undefined dates without errors', () => {
      validateDateFormats(errors, undefined, undefined);

      expect(errors.startDate.hasErrors()).to.be.false;
      expect(errors.endDate.hasErrors()).to.be.false;
    });

    it('should handle empty string dates', () => {
      validateDateFormats(errors, '', '');

      expect(errors.startDate.hasErrors()).to.be.false;
      expect(errors.endDate.hasErrors()).to.be.false;
    });

    it('should use custom error message when provided', () => {
      validateDateFormats(errors, 'invalid', '2023-12-31', {
        errorMessage: 'Custom format error',
      });

      expect(errors.startDate.hasErrors()).to.be.true;
      expect(errors.startDate.getFirstError()).to.equal('Custom format error');
    });

    it('should validate only provided dates', () => {
      // Test with only start date
      validateDateFormats(errors, 'invalid', undefined);
      expect(errors.startDate.hasErrors()).to.be.true;
      expect(errors.endDate.hasErrors()).to.be.false;

      // Reset errors - create new ones
      errors = createDateErrors();

      // Test with only end date
      validateDateFormats(errors, undefined, 'invalid');
      expect(errors.startDate.hasErrors()).to.be.false;
      expect(errors.endDate.hasErrors()).to.be.true;
    });

    it('should handle dates in wrong format order', () => {
      // Day-Month-Year instead of Year-Month-Day
      validateDateFormats(errors, '01-06-2023', '31-12-2023');

      expect(errors.startDate.hasErrors()).to.be.true;
      expect(errors.endDate.hasErrors()).to.be.true;
    });

    it('should handle dates with invalid months', () => {
      validateDateFormats(errors, '2023-13-01', '2023-00-31');

      expect(errors.startDate.hasErrors()).to.be.true;
      expect(errors.endDate.hasErrors()).to.be.true;
    });

    it('should handle dates with invalid days', () => {
      validateDateFormats(errors, '2023-02-30', '2023-11-32');

      expect(errors.startDate.hasErrors()).to.be.true;
      expect(errors.endDate.hasErrors()).to.be.true;
    });
  });
});
