import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';

import {
  validateDateRange,
  validateFutureDate,
  validatePastDate,
  validateDateNotBeforeReference,
  validateSeparationDateWithRules,
  validateTitle10ActivationDate,
} from '../../../utils/dates/validations';

describe('Disability benefits 526EZ -- Date validation utilities', () => {
  describe('validateDateRange', () => {
    it('should add error when dates are required but missing', () => {
      const errors = { addError: sinon.spy() };
      validateDateRange(errors, {});
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include(
        'Please provide both start and end dates',
      );
    });

    it('should use custom message when provided', () => {
      const errors = { addError: sinon.spy() };
      validateDateRange(errors, {}, { customMessage: 'Custom error message' });
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.equal(
        'Custom error message',
      );
    });

    it('should not add error when dates are not required and missing', () => {
      const errors = { addError: sinon.spy() };
      validateDateRange(errors, {}, { required: false });
      expect(errors.addError.called).to.be.false;
    });

    it('should add error when only one date is provided', () => {
      const errors = { addError: sinon.spy() };
      validateDateRange(errors, { from: '2023-01-01' });
      expect(errors.addError.called).to.be.true;
    });

    it('should add error for invalid date values', () => {
      const errors = { addError: sinon.spy() };
      validateDateRange(errors, { from: 'invalid', to: '2023-01-01' });
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include('valid dates');
    });

    it('should add error when end date is before start date', () => {
      const errors = { addError: sinon.spy() };
      validateDateRange(errors, { from: '2023-06-01', to: '2023-01-01' });
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include(
        'End date must be after start date',
      );
    });

    it('should add error when range exceeds maxDays', () => {
      const errors = { addError: sinon.spy() };
      validateDateRange(
        errors,
        { from: '2023-01-01', to: '2023-12-31' },
        { maxDays: 30 },
      );
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include(
        'cannot exceed 30 days',
      );
    });

    it('should add error when range is less than minDays', () => {
      const errors = { addError: sinon.spy() };
      validateDateRange(
        errors,
        { from: '2023-01-01', to: '2023-01-05' },
        { minDays: 10 },
      );
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include('at least 10 days');
    });

    it('should not add error for valid date range', () => {
      const errors = { addError: sinon.spy() };
      validateDateRange(errors, { from: '2023-01-01', to: '2023-06-01' });
      expect(errors.addError.called).to.be.false;
    });
  });

  describe('validateFutureDate', () => {
    const clock = sinon.useFakeTimers(new Date('2023-06-15'));

    after(() => {
      clock.restore();
    });

    it('should add error for invalid date', () => {
      const errors = { addError: sinon.spy() };
      validateFutureDate(errors, 'invalid');
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include('valid date');
    });

    it('should add error for past date (non-inclusive)', () => {
      const errors = { addError: sinon.spy() };
      validateFutureDate(errors, '2023-06-14');
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include(
        'must be in the future',
      );
    });

    it('should add error for today (non-inclusive)', () => {
      const errors = { addError: sinon.spy() };
      validateFutureDate(errors, '2023-06-15');
      expect(errors.addError.called).to.be.true;
    });

    it('should not add error for today when inclusive', () => {
      const errors = { addError: sinon.spy() };
      validateFutureDate(errors, '2023-06-15', { inclusive: true });
      expect(errors.addError.called).to.be.false;
    });

    it('should use custom message', () => {
      const errors = { addError: sinon.spy() };
      validateFutureDate(errors, '2023-06-14', {
        customMessage: 'Must be a future date',
      });
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.equal(
        'Must be a future date',
      );
    });

    it('should validate maxDaysInFuture', () => {
      const errors = { addError: sinon.spy() };
      const futureDate = moment()
        .add(100, 'days')
        .format('YYYY-MM-DD');
      validateFutureDate(errors, futureDate, { maxDaysInFuture: 90 });
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include('within 90 days');
    });

    it('should not add error for valid future date', () => {
      const errors = { addError: sinon.spy() };
      validateFutureDate(errors, '2023-06-16');
      expect(errors.addError.called).to.be.false;
    });
  });

  describe('validatePastDate', () => {
    const clock = sinon.useFakeTimers(new Date('2023-06-15'));

    after(() => {
      clock.restore();
    });

    it('should add error for invalid date', () => {
      const errors = { addError: sinon.spy() };
      validatePastDate(errors, 'invalid');
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include('valid date');
    });

    it('should add error for future date (inclusive)', () => {
      const errors = { addError: sinon.spy() };
      validatePastDate(errors, '2023-06-16');
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include(
        'must be in the past',
      );
    });

    it('should not add error for today (inclusive)', () => {
      const errors = { addError: sinon.spy() };
      validatePastDate(errors, '2023-06-15');
      expect(errors.addError.called).to.be.false;
    });

    it('should add error for today when non-inclusive', () => {
      const errors = { addError: sinon.spy() };
      validatePastDate(errors, '2023-06-15', { inclusive: false });
      expect(errors.addError.called).to.be.true;
    });

    it('should use custom message', () => {
      const errors = { addError: sinon.spy() };
      validatePastDate(errors, '2023-06-16', {
        customMessage: 'Must be a past date',
      });
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.equal('Must be a past date');
    });

    it('should validate minDate', () => {
      const errors = { addError: sinon.spy() };
      validatePastDate(errors, '2020-01-01', { minDate: '2021-01-01' });
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include(
        'on or after 01/01/2021',
      );
    });

    it('should not add error for valid past date', () => {
      const errors = { addError: sinon.spy() };
      validatePastDate(errors, '2023-06-14');
      expect(errors.addError.called).to.be.false;
    });
  });

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
      validateDateNotBeforeReference(errors, '2023-01-01', '2023-06-01');
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include(
        'on or after 06/01/2023',
      );
    });

    it('should not add error when date equals reference (inclusive)', () => {
      const errors = { addError: sinon.spy() };
      validateDateNotBeforeReference(errors, '2023-06-01', '2023-06-01');
      expect(errors.addError.called).to.be.false;
    });

    it('should add error when date equals reference (non-inclusive)', () => {
      const errors = { addError: sinon.spy() };
      validateDateNotBeforeReference(errors, '2023-06-01', '2023-06-01', {
        inclusive: false,
      });
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include('after 06/01/2023');
    });

    it('should use custom message', () => {
      const errors = { addError: sinon.spy() };
      validateDateNotBeforeReference(errors, '2023-01-01', '2023-06-01', {
        customMessage: 'Date too early',
      });
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.equal('Date too early');
    });

    it('should not add error when date is after reference', () => {
      const errors = { addError: sinon.spy() };
      validateDateNotBeforeReference(errors, '2023-07-01', '2023-06-01');
      expect(errors.addError.called).to.be.false;
    });
  });

  describe('validateSeparationDateWithRules', () => {
    const clock = sinon.useFakeTimers(new Date('2023-06-15'));

    after(() => {
      clock.restore();
    });

    it('should add error for invalid date', () => {
      const errors = { addError: sinon.spy() };
      validateSeparationDateWithRules(errors, 'invalid-date');
      expect(errors.addError.called).to.be.true;
      expect(errors.addError.firstCall.args[0]).to.include('not a real date');
    });

    describe('BDD validation', () => {
      it('should allow dates up to 180 days in future for BDD', () => {
        const errors = { addError: sinon.spy() };
        const date150Days = moment()
          .add(150, 'days')
          .format('YYYY-MM-DD');
        validateSeparationDateWithRules(errors, date150Days, { isBDD: true });
        expect(errors.addError.called).to.be.false;
      });

      it('should add error for dates more than 180 days for BDD', () => {
        const errors = { addError: sinon.spy() };
        const date181Days = moment()
          .add(181, 'days')
          .format('YYYY-MM-DD');
        validateSeparationDateWithRules(errors, date181Days, { isBDD: true });
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include('before 180 days');
      });
    });

    describe('Non-BDD validation', () => {
      it('should add error for dates more than 180 days', () => {
        const errors = { addError: sinon.spy() };
        const date181Days = moment()
          .add(181, 'days')
          .format('YYYY-MM-DD');
        validateSeparationDateWithRules(errors, date181Days);
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'Benefits Delivery at Discharge',
        );
      });

      it('should add error for future dates >= 90 days for non-reserves', () => {
        const errors = { addError: sinon.spy() };
        const date90Days = moment()
          .add(90, 'days')
          .format('YYYY-MM-DD');
        validateSeparationDateWithRules(errors, date90Days);
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'must be in the past',
        );
      });

      it('should allow future dates for reserves', () => {
        const errors = { addError: sinon.spy() };
        const date100Days = moment()
          .add(100, 'days')
          .format('YYYY-MM-DD');
        validateSeparationDateWithRules(errors, date100Days, {
          isReserves: true,
        });
        expect(errors.addError.called).to.be.false;
      });

      it('should allow past dates', () => {
        const errors = { addError: sinon.spy() };
        const pastDate = moment()
          .subtract(100, 'days')
          .format('YYYY-MM-DD');
        validateSeparationDateWithRules(errors, pastDate);
        expect(errors.addError.called).to.be.false;
      });
    });
  });

  describe('validateTitle10ActivationDate', () => {
    const clock = sinon.useFakeTimers(new Date('2023-06-15'));

    after(() => {
      clock.restore();
    });

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
      const futureDate = moment()
        .add(1, 'days')
        .format('YYYY-MM-DD');
      validateTitle10ActivationDate(errors, futureDate, [], reservesList);
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
});
