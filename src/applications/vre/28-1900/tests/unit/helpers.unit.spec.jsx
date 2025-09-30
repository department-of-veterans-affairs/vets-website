import { expect } from 'chai';
import { formatDate } from '../../helpers';

describe('helpers', () => {
  describe('formatDate', () => {
    it('should format ISO date string with Z suffix', () => {
      const result = formatDate('1901-09-11Z');
      expect(result).to.equal('September 11, 1901');
    });

    it('should format ISO date string without Z suffix', () => {
      const result = formatDate('1941-12-05');
      expect(result).to.equal('December 5, 1941');
    });

    it('should handle various date formats with Z', () => {
      const testCases = [
        { input: '2025-08-04Z', expected: 'August 4, 2025' },
        { input: '2023-04-01Z', expected: 'April 1, 2023' },
        { input: '2025-02-07Z', expected: 'February 7, 2025' },
        { input: '2000-01-01Z', expected: 'January 1, 2000' },
        { input: '1999-12-31Z', expected: 'December 31, 1999' },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(formatDate(input)).to.equal(expected);
      });
    });

    it('should return empty string for falsy inputs', () => {
      const falsyInputs = [null, undefined, '', false, 0, NaN];

      falsyInputs.forEach(input => {
        expect(formatDate(input)).to.equal('');
      });
    });
  });
});
