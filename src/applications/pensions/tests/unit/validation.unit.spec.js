import { expect } from 'chai';
import sinon from 'sinon';

import {
  isValidCurrency,
  validateAfterMarriageDate,
  validateAfterMarriageDates,
  validateCurrency,
  validateServiceBirthDates,
  validateUniqueMarriageDates,
} from '../../validation';

describe('Pension validation', () => {
  describe('validateAfterMarriageDate', () => {
    it('should add error if date of marriage is after date of separation', () => {
      const errors = {
        addError: sinon.spy(),
      };

      validateAfterMarriageDate(errors, '2014-01-01', {
        dateOfMarriage: '2016-01-01',
      });

      expect(errors.addError.called).to.be.true;
    });
  });
  describe('validateAfterMarriageDates', () => {
    it('should add error if date of marriage is after date of separation within array data', () => {
      const errors = {
        addError: sinon.spy(),
      };

      validateAfterMarriageDates(errors, '2014-01-01', {
        spouseMarriages: [
          { dateOfMarriage: '2016-01-01', dateOfSeparation: '2014-01-01' },
          { dateOfMarriage: '2012-01-01', dateOfSeparation: '2013-01-01' },
        ],
      });

      expect(errors.addError.called).to.be.true;
    });
  });
  describe('validateUniqueMarriageDates', () => {
    it('should add error if the marriage date is not unique', () => {
      const errors = {
        addError: sinon.spy(),
      };

      validateUniqueMarriageDates(errors, '2016-01-01', {
        spouseMarriages: [
          { dateOfMarriage: '2016-01-01', dateOfSeparation: '2017-01-01' },
          { dateOfMarriage: '2016-01-01', dateOfSeparation: '2018-01-01' },
          { dateOfMarriage: '2012-01-01', dateOfSeparation: '2013-01-01' },
        ],
      });

      expect(errors.addError.called).to.be.true;
    });
  });
  describe('validateServiceBirthDates', () => {
    it('should add error if date entered is before birth date', () => {
      const errors = {
        activeServiceDateRange: {
          from: {
            addError: sinon.spy(),
          },
        },
      };

      validateServiceBirthDates(
        errors,
        {
          activeServiceDateRange: {
            from: '2015-01-02',
          },
        },
        { veteranDateOfBirth: '2016-01-01' },
      );

      expect(errors.activeServiceDateRange.from.addError.called).to.be.true;
    });
  });
  describe('validateCurrency', () => {
    it('should validate number is US currency', () => {
      const errors = {
        addError: sinon.spy(),
      };

      validateCurrency(errors, 0.0);
      validateCurrency(errors, 1000);
      validateCurrency(errors, 12.75);

      expect(errors.addError.called).to.be.false;
    });
    it('should add an error if number is negative', () => {
      const errors = {
        addError: sinon.spy(),
      };

      validateCurrency(errors, -1);

      expect(errors.addError.called).to.be.true;
    });
    it('should add an error if number is not a number', () => {
      const errors = {
        addError: sinon.spy(),
      };

      validateCurrency(errors, 'abc');

      expect(errors.addError.called).to.be.true;
    });
    it('should add an error if number has too many decimals', () => {
      const errors = {
        addError: sinon.spy(),
      };

      validateCurrency(errors, 0.123);

      expect(errors.addError.called).to.be.true;
    });
  });
});

describe('isValidCurrency', () => {
  it('should return true for valid currency amount', () => {
    const validCurrencyAmounts = ['1,000.00', '500', '0.99', '1,234,567.89'];

    validCurrencyAmounts.forEach(amount => {
      const result = isValidCurrency(amount);
      expect(result).to.be.true;
    });
  });

  it('should return false for invalid currency amount', () => {
    const invalidCurrencyAmounts = [
      '$1,000.00',
      'abc',
      '-$500',
      '1.234',
      '1.234.567',
    ];

    invalidCurrencyAmounts.forEach(amount => {
      const result = isValidCurrency(amount);
      expect(result).to.be.false;
    });
  });
});
