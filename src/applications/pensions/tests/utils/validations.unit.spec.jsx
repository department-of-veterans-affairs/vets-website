import { expect } from 'chai';
import { isValidCurrency } from '../../utils/validations';

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
      '',
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
