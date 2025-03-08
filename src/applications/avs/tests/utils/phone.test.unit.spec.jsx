import { assert, expect } from 'chai';
import { normalizePhoneNumber, numberIsClickable } from '../../utils/phone';

describe('avs', () => {
  describe('phone utils', () => {
    describe('normalize phone number', () => {
      it('correctly removes non-digit characters', () => {
        const phoneWithAlpha = '2392A123';
        const expected = '2392123';
        const result = normalizePhoneNumber(phoneWithAlpha);
        assert.deepEqual(result, expected);
      });

      it('removes leading 1 characters', () => {
        const phoneWithLeading1 = '15055553939';
        const expected = '5055553939';
        const result = normalizePhoneNumber(phoneWithLeading1);
        assert.deepEqual(result, expected);
      });

      it('returns 10 digit numbers unchanged', () => {
        const tenDigitPhone = '5055553939';
        const expected = '5055553939';
        const result = normalizePhoneNumber(tenDigitPhone);
        assert.deepEqual(result, expected);
      });
    });

    describe('number is clickable', () => {
      it('returns true for a 10 digit number', () => {
        const tenDigitPhone = '5055553939';
        expect(numberIsClickable(tenDigitPhone)).to.be.true;
      });

      it('returns false for longer numbers', () => {
        const twelveDigitPhone = '505555393912';
        expect(numberIsClickable(twelveDigitPhone)).to.be.false;
      });

      it('returns false for shorter numbers', () => {
        const sevenDigitPhone = '5553939';
        expect(numberIsClickable(sevenDigitPhone)).to.be.false;
      });
    });
  });
});
