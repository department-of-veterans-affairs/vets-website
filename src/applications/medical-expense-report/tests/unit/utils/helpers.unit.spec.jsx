import { expect } from 'chai';
import { parseISO } from 'date-fns';
import {
  isSameOrAfter,
  isProductionEnv,
  showMultiplePageResponse,
} from '../../../utils/helpers';

describe('Helpers', () => {
  describe('isSameOrAfter', () => {
    it('should return true when first date is after second date', () => {
      const date1 = parseISO('2025-01-02');
      const date2 = parseISO('2025-01-01');

      expect(isSameOrAfter(date1, date2)).to.be.true;
    });

    it('should return true when dates are equal', () => {
      const date1 = parseISO('2025-01-01');
      const date2 = parseISO('2025-01-01');

      expect(isSameOrAfter(date1, date2)).to.be.true;
    });

    it('should return false when first date is before second date', () => {
      const date1 = parseISO('2025-01-01');
      const date2 = parseISO('2025-01-02');

      expect(isSameOrAfter(date1, date2)).to.be.false;
    });
  });

  describe('isProductionEnv', () => {
    it('should return a boolean value', () => {
      const result = isProductionEnv();
      expect(typeof result).to.equal('boolean');
    });

    it('should return false in test environment (Mocha is present)', () => {
      expect(isProductionEnv()).to.be.false;
    });
  });

  describe('showMultiplePageResponse', () => {
    it('should return a boolean value', () => {
      const result = showMultiplePageResponse();
      expect(typeof result).to.equal('boolean');
    });

    it('should return false by default in test environment', () => {
      expect(showMultiplePageResponse()).to.be.false;
    });
  });
});
