import { expect } from 'chai';
import { getExpenseType, formatAmount } from '../../util/complex-claims-helper';
import { EXPENSE_TYPES, EXPENSE_TYPE_KEYS } from '../../constants';

describe('expense helpers', () => {
  describe('getExpenseType', () => {
    it('returns the exact matching expense type object', () => {
      const result = getExpenseType('Mileage');
      expect(result).to.deep.equal(EXPENSE_TYPES.Mileage);
    });

    it('returns the expense type object for case-insensitive key', () => {
      const result = getExpenseType('mileage');
      expect(result).to.deep.equal(EXPENSE_TYPES.Mileage);
    });

    it('returns null for a non-existent expense type key', () => {
      const result = getExpenseType('InvalidKey');
      expect(result).to.be.null;
    });

    it('returns null if no key is provided', () => {
      expect(getExpenseType()).to.be.null;
      expect(getExpenseType('')).to.be.null;
    });

    it('works for other valid expense types', () => {
      expect(getExpenseType('AirTravel')).to.deep.equal(
        EXPENSE_TYPES[EXPENSE_TYPE_KEYS.AIRTRAVEL],
      );
      expect(getExpenseType('CommonCarrier')).to.deep.equal(
        EXPENSE_TYPES[EXPENSE_TYPE_KEYS.COMMONCARRIER],
      );
    });
  });

  describe('formatAmount', () => {
    it('formats whole numbers with two decimal places', () => {
      expect(formatAmount(20)).to.equal('20.00');
      expect(formatAmount(0)).to.equal('0.00');
    });

    it('formats numbers with one decimal place', () => {
      expect(formatAmount(10.1)).to.equal('10.10');
    });

    it('formats numbers with two decimal places unchanged', () => {
      expect(formatAmount(10.01)).to.equal('10.01');
    });

    it('formats string numbers correctly', () => {
      expect(formatAmount('15')).to.equal('15.00');
      expect(formatAmount('7.5')).to.equal('7.50');
    });

    it('returns "0.00" for null, undefined, or NaN', () => {
      expect(formatAmount(null)).to.equal('0.00');
      expect(formatAmount(undefined)).to.equal('0.00');
      expect(formatAmount(NaN)).to.equal('0.00');
    });
  });
});
