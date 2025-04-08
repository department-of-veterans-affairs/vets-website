import { expect } from 'chai';

import formatCurrency, {
  getFormatter,
  checkIntl,
} from '../../../src/js/utilities/data/formatCurrency';

describe('formatCurrency file', () => {
  const supportsIntl = () => true;
  const noSupportIntl = () => false;

  describe('formatCurrency', () => {
    it('should format a number to currency', () => {
      const result = formatCurrency(1234.56, { supportsIntl });
      expect(result).to.equal('$1,234.56');
    });

    it('should format a number to currency if Intl is not supported', () => {
      const result = formatCurrency(1234.56, { supportsIntl: noSupportIntl });
      expect(result).to.equal('$1,234.56');
    });

    it('should return the original value if not a number', () => {
      const result = formatCurrency('not a number', { supportsIntl });
      expect(result).to.equal('not a number');
    });

    it('should handle negative numbers', () => {
      const result = formatCurrency(-1234.56, { supportsIntl });
      expect(result).to.equal('-$1,234.56');
    });

    it('should handle zero', () => {
      const result = formatCurrency(0, { supportsIntl });
      expect(result).to.equal('$0.00');
    });

    it('should handle large numbers', () => {
      const result = formatCurrency(1234567890.12, { supportsIntl });
      expect(result).to.equal('$1,234,567,890.12');
    });

    it('should handle small numbers', () => {
      const result = formatCurrency(0.01, { supportsIntl });
      expect(result).to.equal('$0.01');
    });

    it('should use the specified locale', () => {
      const result = formatCurrency(1234.56, {
        locale: 'de-DE',
        currency: 'EUR',
        supportsIntl,
      });
      expect(result).to.equal('1.234,56 €');
    });
  });

  describe('getFormatter', () => {
    it('should return a formatter for Intl.NumberFormat', () => {
      const formatter = getFormatter({ locale: 'en-US', supportsIntl });
      expect(formatter.format(1234.56)).to.equal('$1,234.56');
    });

    it('should return a fallback formatter if Intl is not supported', () => {
      const formatter = getFormatter({
        locale: 'en-US',
        supportsIntl: noSupportIntl,
      });
      expect(formatter.format('abc')).to.equal('abc');
      expect(formatter.format(1234.15)).to.equal('$1,234.15');
      // using toLocaleString doesn't include the last zero :(
      expect(formatter.format(1234.1)).to.equal('$1,234.1');
    });

    it('should return a fallback formatter if Intl is not supported with custom currency symbol', () => {
      const formatter = getFormatter({
        locale: 'en-US',
        currencySymbol: 'USD',
        supportsIntl: noSupportIntl,
      });
      expect(formatter.format('abc')).to.equal('abc');
      expect(formatter.format(1234.15)).to.equal('USD1,234.15');
    });
  });

  describe('checkIntl', () => {
    it('should return true if Intl is supported', () => {
      expect(checkIntl({ Intl: { NumberFormat: supportsIntl } })).to.be.true;
    });

    it('should return false if Intl is not supported', () => {
      expect(checkIntl({ Intl: {} })).to.be.false;
    });
  });
});
