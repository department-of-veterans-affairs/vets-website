import { expect } from 'chai';
import sinon from 'sinon';

import {
  isValidCurrency,
  validateAfterMarriageDate,
  validateServiceBirthDates,
} from '../validation';

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
