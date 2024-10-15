import { expect } from 'chai';
import reviewErrors from '../reviewErrors';

describe('reviewErrors', () => {
  describe('condition', () => {
    it('returns condition text', () => {
      expect(reviewErrors.condition(2)).to.equal(
        'New conditions (in the third section, enter a condition or select one from the list)',
      );
    });
  });

  describe('newDisabilities', () => {
    it('returns null', () => {
      // for coverage
      expect(reviewErrors.newDisabilities()).to.equal(null);
    });
  });
});
