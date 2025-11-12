import { expect } from 'chai';
import { formatDate } from './dateFormat';

describe('dateFormat utilities', () => {
  describe('formatDate', () => {
    it('should format valid date string in YYYY-MM-DD format', () => {
      const result = formatDate('1985-03-22');
      expect(result).to.be.a('string');
      expect(result).to.not.equal('Not provided');
    });

    it('should format valid date string in YYYY/MM/DD format', () => {
      const result = formatDate('1985/03/22');
      expect(result).to.be.a('string');
      expect(result).to.not.equal('Not provided');
    });

    it('should handle date with dashes', () => {
      const result = formatDate('2020-01-15');
      expect(result).to.be.a('string');
      expect(result).to.not.equal('Not provided');
    });

    it('should handle date with slashes', () => {
      const result = formatDate('2020/01/15');
      expect(result).to.be.a('string');
      expect(result).to.not.equal('Not provided');
    });

    it('should return "Not provided" for empty string', () => {
      const result = formatDate('');
      expect(result).to.equal('Not provided');
    });

    it('should return "Not provided" for null', () => {
      const result = formatDate(null);
      expect(result).to.equal('Not provided');
    });

    it('should return "Not provided" for undefined', () => {
      const result = formatDate(undefined);
      expect(result).to.equal('Not provided');
    });

    it('should return "Not provided" for invalid date string', () => {
      const result = formatDate('invalid-date');
      expect(result).to.equal('Not provided');
    });

    it('should return "Not provided" for malformed date', () => {
      const result = formatDate('13/32/2020');
      expect(result).to.equal('Not provided');
    });

    it('should handle old dates', () => {
      const result = formatDate('1920-01-01');
      expect(result).to.be.a('string');
      expect(result).to.not.equal('Not provided');
    });

    it('should handle recent dates', () => {
      const result = formatDate('2023-12-31');
      expect(result).to.be.a('string');
      expect(result).to.not.equal('Not provided');
    });

    it('should handle leap year date', () => {
      const result = formatDate('2020-02-29');
      expect(result).to.be.a('string');
      expect(result).to.not.equal('Not provided');
    });

    it('should format non-leap year Feb 29 (JS Date rolls over to Mar 1)', () => {
      const result = formatDate('2019-02-29');

      expect(result).to.not.equal('Not provided');
      expect(result).to.be.a('string');
    });

    it('should handle date at start of year', () => {
      const result = formatDate('2020-01-01');
      expect(result).to.be.a('string');
      expect(result).to.not.equal('Not provided');
    });

    it('should handle date at end of year', () => {
      const result = formatDate('2020-12-31');
      expect(result).to.be.a('string');
      expect(result).to.not.equal('Not provided');
    });

    it('should return "Not provided" for date with invalid month', () => {
      const result = formatDate('2020-13-01');
      expect(result).to.equal('Not provided');
    });

    it('should return "Not provided" for date with invalid day', () => {
      const result = formatDate('2020-01-32');
      expect(result).to.equal('Not provided');
    });

    it('should handle date string with leading zeros', () => {
      const result = formatDate('2020-01-05');
      expect(result).to.be.a('string');
      expect(result).to.not.equal('Not provided');
    });

    it('should return input or "Not provided" for completely invalid input', () => {
      const result = formatDate('completely invalid');
      expect(result).to.satisfy(
        r => r === 'completely invalid' || r === 'Not provided',
      );
    });

    it('should handle dates from different centuries', () => {
      const result = formatDate('1850-06-15');
      expect(result).to.be.a('string');
      expect(result).to.not.equal('Not provided');
    });

    it('should return input value for boolean input (error handling)', () => {
      const result = formatDate(true);

      expect(result).to.equal(true);
    });

    it('should return input value for numeric input (error handling)', () => {
      const result = formatDate(12345);

      expect(result).to.equal(12345);
    });

    it('should return input value for object input (error handling)', () => {
      const result = formatDate({ date: '2020-01-01' });

      expect(result).to.deep.equal({ date: '2020-01-01' });
    });

    it('should return input value for array input (error handling)', () => {
      const result = formatDate(['2020-01-01']);

      expect(result).to.deep.equal(['2020-01-01']);
    });
  });
});
