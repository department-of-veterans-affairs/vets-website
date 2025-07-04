import { expect } from 'chai';

import {
  isDateBefore,
  isDateAfter,
  isDateSame,
  isDateBetween,
  compareDates,
} from '../../../utils/dates/comparisons';

describe('Disability benefits 526EZ -- Date comparison utilities', () => {
  describe('isDateBefore', () => {
    it('should return true when date1 is before date2', () => {
      expect(isDateBefore('2023-01-01', '2023-06-01')).to.be.true;
      expect(isDateBefore('2023-01-01', '2024-01-01')).to.be.true;
    });

    it('should return false when date1 is after date2', () => {
      expect(isDateBefore('2023-06-01', '2023-01-01')).to.be.false;
      expect(isDateBefore('2024-01-01', '2023-01-01')).to.be.false;
    });

    it('should return false when dates are the same', () => {
      expect(isDateBefore('2023-01-01', '2023-01-01')).to.be.false;
    });

    it('should handle different granularities', () => {
      expect(isDateBefore('2023-01-15', '2023-01-20', 'month')).to.be.false;
      expect(isDateBefore('2023-01-15', '2023-02-15', 'month')).to.be.true;
      expect(isDateBefore('2023-01-15', '2024-01-15', 'year')).to.be.true;
    });

    it('should return false for invalid dates', () => {
      expect(isDateBefore(null, '2023-01-01')).to.be.false;
      expect(isDateBefore('2023-01-01', null)).to.be.false;
      expect(isDateBefore('invalid', '2023-01-01')).to.be.false;
      expect(isDateBefore('2023-01-01', 'invalid')).to.be.false;
    });
  });

  describe('isDateAfter', () => {
    it('should return true when date1 is after date2', () => {
      expect(isDateAfter('2023-06-01', '2023-01-01')).to.be.true;
      expect(isDateAfter('2024-01-01', '2023-01-01')).to.be.true;
    });

    it('should return false when date1 is before date2', () => {
      expect(isDateAfter('2023-01-01', '2023-06-01')).to.be.false;
      expect(isDateAfter('2023-01-01', '2024-01-01')).to.be.false;
    });

    it('should return false when dates are the same', () => {
      expect(isDateAfter('2023-01-01', '2023-01-01')).to.be.false;
    });

    it('should handle different granularities', () => {
      expect(isDateAfter('2023-01-20', '2023-01-15', 'month')).to.be.false;
      expect(isDateAfter('2023-02-15', '2023-01-15', 'month')).to.be.true;
      expect(isDateAfter('2024-01-15', '2023-01-15', 'year')).to.be.true;
    });

    it('should return false for invalid dates', () => {
      expect(isDateAfter(null, '2023-01-01')).to.be.false;
      expect(isDateAfter('2023-01-01', null)).to.be.false;
      expect(isDateAfter('invalid', '2023-01-01')).to.be.false;
      expect(isDateAfter('2023-01-01', 'invalid')).to.be.false;
    });
  });

  describe('isDateSame', () => {
    it('should return true when dates are the same', () => {
      expect(isDateSame('2023-01-01', '2023-01-01')).to.be.true;
      expect(isDateSame('2023-06-15', '2023-06-15')).to.be.true;
    });

    it('should return false when dates are different', () => {
      expect(isDateSame('2023-01-01', '2023-01-02')).to.be.false;
      expect(isDateSame('2023-01-01', '2024-01-01')).to.be.false;
    });

    it('should handle different granularities', () => {
      expect(isDateSame('2023-01-15', '2023-01-20', 'month')).to.be.true;
      expect(isDateSame('2023-01-15', '2023-02-15', 'month')).to.be.false;
      expect(isDateSame('2023-01-15', '2023-06-15', 'year')).to.be.true;
      expect(isDateSame('2023-01-15', '2024-01-15', 'year')).to.be.false;
    });

    it('should return false for invalid dates', () => {
      expect(isDateSame(null, '2023-01-01')).to.be.false;
      expect(isDateSame('2023-01-01', null)).to.be.false;
      expect(isDateSame('invalid', '2023-01-01')).to.be.false;
      expect(isDateSame('2023-01-01', 'invalid')).to.be.false;
    });
  });

  describe('isDateBetween', () => {
    it('should return true when date is between start and end (inclusive)', () => {
      expect(isDateBetween('2023-06-15', '2023-01-01', '2023-12-31')).to.be
        .true;
      expect(isDateBetween('2023-01-01', '2023-01-01', '2023-12-31')).to.be
        .true;
      expect(isDateBetween('2023-12-31', '2023-01-01', '2023-12-31')).to.be
        .true;
    });

    it('should return false when date is outside range', () => {
      expect(isDateBetween('2022-12-31', '2023-01-01', '2023-12-31')).to.be
        .false;
      expect(isDateBetween('2024-01-01', '2023-01-01', '2023-12-31')).to.be
        .false;
    });

    it('should handle different inclusivity options', () => {
      // '()' - exclusive
      expect(
        isDateBetween('2023-01-01', '2023-01-01', '2023-12-31', 'day', '()'),
      ).to.be.false;
      expect(
        isDateBetween('2023-12-31', '2023-01-01', '2023-12-31', 'day', '()'),
      ).to.be.false;

      // '[)' - start inclusive, end exclusive
      expect(
        isDateBetween('2023-01-01', '2023-01-01', '2023-12-31', 'day', '[)'),
      ).to.be.true;
      expect(
        isDateBetween('2023-12-31', '2023-01-01', '2023-12-31', 'day', '[)'),
      ).to.be.false;

      // '(]' - start exclusive, end inclusive
      expect(
        isDateBetween('2023-01-01', '2023-01-01', '2023-12-31', 'day', '(]'),
      ).to.be.false;
      expect(
        isDateBetween('2023-12-31', '2023-01-01', '2023-12-31', 'day', '(]'),
      ).to.be.true;
    });

    it('should handle different granularities', () => {
      expect(isDateBetween('2023-06-15', '2023-01-01', '2023-12-31', 'month'))
        .to.be.true;
      expect(isDateBetween('2023-06-15', '2022-01-01', '2024-12-31', 'year')).to
        .be.true;
    });

    it('should return false for invalid dates', () => {
      expect(isDateBetween(null, '2023-01-01', '2023-12-31')).to.be.false;
      expect(isDateBetween('2023-06-15', null, '2023-12-31')).to.be.false;
      expect(isDateBetween('2023-06-15', '2023-01-01', null)).to.be.false;
      expect(isDateBetween('invalid', '2023-01-01', '2023-12-31')).to.be.false;
    });
  });

  describe('compareDates', () => {
    const date1 = '2023-01-01';
    const date2 = '2023-06-01';
    const sameDate = '2023-01-01';

    it('should handle < operator', () => {
      expect(compareDates(date1, date2, '<')).to.be.true;
      expect(compareDates(date2, date1, '<')).to.be.false;
      expect(compareDates(date1, sameDate, '<')).to.be.false;
    });

    it('should handle > operator', () => {
      expect(compareDates(date2, date1, '>')).to.be.true;
      expect(compareDates(date1, date2, '>')).to.be.false;
      expect(compareDates(date1, sameDate, '>')).to.be.false;
    });

    it('should handle <= operator', () => {
      expect(compareDates(date1, date2, '<=')).to.be.true;
      expect(compareDates(date2, date1, '<=')).to.be.false;
      expect(compareDates(date1, sameDate, '<=')).to.be.true;
    });

    it('should handle >= operator', () => {
      expect(compareDates(date2, date1, '>=')).to.be.true;
      expect(compareDates(date1, date2, '>=')).to.be.false;
      expect(compareDates(date1, sameDate, '>=')).to.be.true;
    });

    it('should handle == operator', () => {
      expect(compareDates(date1, sameDate, '==')).to.be.true;
      expect(compareDates(date1, date2, '==')).to.be.false;
    });

    it('should handle != operator', () => {
      expect(compareDates(date1, date2, '!=')).to.be.true;
      expect(compareDates(date1, sameDate, '!=')).to.be.false;
    });

    it('should handle different granularities', () => {
      expect(compareDates('2023-01-15', '2023-01-20', '==', 'month')).to.be
        .true;
      expect(compareDates('2023-01-15', '2023-02-15', '<', 'month')).to.be.true;
    });

    it('should throw error for invalid operator', () => {
      expect(() => compareDates(date1, date2, 'invalid')).to.throw(
        'Invalid operator: invalid',
      );
    });

    it('should return false for invalid dates', () => {
      expect(compareDates(null, date2, '<')).to.be.false;
      expect(compareDates(date1, null, '<')).to.be.false;
      expect(compareDates('invalid', date2, '<')).to.be.false;
    });
  });
});
