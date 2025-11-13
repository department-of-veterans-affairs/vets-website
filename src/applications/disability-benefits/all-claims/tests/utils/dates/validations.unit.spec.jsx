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
        const date120Days = moment()
          .add(120, 'days')
          .format('YYYY-MM-DD');
        validateSeparationDateWithRules(errors, date120Days, { isBDD: true });
        expect(errors.addError.called).to.be.false;
      });

      it('should add error for dates more than 180 days for BDD', () => {
        const errors = { addError: sinon.spy() };
        const date181Days = moment()
          .add(181, 'days')
          .format('YYYY-MM-DD');
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
        const date181Days = moment()
          .add(181, 'days')
          .format('YYYY-MM-DD');
        validateSeparationDateWithRules(errors, date181Days);
        expect(errors.addError.called).to.be.true;
        expect(errors.addError.firstCall.args[0]).to.include(
          'more than 180 days from now',
        );
      });

      it('should add error for future dates when not reserves', () => {
        const errors = { addError: sinon.spy() };
        const date100Days = moment()
          .add(100, 'days')
          .format('YYYY-MM-DD');
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
        const date100Days = moment()
          .add(100, 'days')
          .format('YYYY-MM-DD');
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
      const tomorrow = moment()
        .add(1, 'day')
        .format('YYYY-MM-DD');
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
});
