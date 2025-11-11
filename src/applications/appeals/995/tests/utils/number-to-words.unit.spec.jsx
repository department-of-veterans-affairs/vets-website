import { expect } from 'chai';
import numberToWords from '../../utils/number-to-words';

describe('numberToWords', () => {
  describe('invalid inputs', () => {
    it('should return original value for null or undefined', () => {
      expect(numberToWords(null)).to.equal(null);
      expect(numberToWords(undefined)).to.equal(undefined);
      expect(numberToWords()).to.equal(undefined);
    });

    it('should return original value for non-numeric strings', () => {
      expect(numberToWords('abc')).to.equal('abc');
      expect(numberToWords('test')).to.equal('test');
    });

    it('should return original value for fractional numbers', () => {
      expect(numberToWords(1.5)).to.equal(1.5);
      expect(numberToWords(10.7)).to.equal(10.7);
      expect(numberToWords(99.99)).to.equal(99.99);
    });

    it('should return original value for zero or negative numbers', () => {
      expect(numberToWords(0)).to.equal(0);
      expect(numberToWords(-1)).to.equal(-1);
      expect(numberToWords(-50)).to.equal(-50);
    });
  });

  describe('ordinal conversion', () => {
    const testCases = {
      1: 'first',
      2: 'second',
      3: 'third',
      4: 'fourth',
      5: 'fifth',
      6: 'sixth',
      7: 'seventh',
      8: 'eighth',
      9: 'ninth',
      10: 'tenth',
      11: '11th',
      12: '12th',
      13: '13th',
      14: '14th',
      20: '20th',
      21: '21st',
      23: '23rd',
      24: '24th',
      30: '30th',
      31: '31st',
      32: '32nd',
      34: '34th',
      50: '50th',
      52: '52nd',
      53: '53rd',
      54: '54th',
      60: '60th',
      61: '61st',
      70: '70th',
      72: '72nd',
      73: '73rd',
      93: '93rd',
      100: '100th',
    };

    Object.entries(testCases).forEach(([input, expected]) => {
      it(`should convert ${input} to "${expected}"`, () => {
        expect(numberToWords(Number(input))).to.equal(expected);
      });
    });
  });
});
