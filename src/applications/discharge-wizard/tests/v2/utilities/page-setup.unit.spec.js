import { expect } from 'chai';
import { customizeTitle } from '../../../utilities/page-setup';

describe('Page Setup Utilities', () => {
  describe('Customize Title', () => {
    it('should return the correct title with the H1', () => {
      expect(customizeTitle('THIS IS MY H1')).to.equal(
        'THIS IS MY H1 | How to Apply for A Discharge Upgrade | Veterans Affairs',
      );
    });

    it('should return the correct title without a n H1', () => {
      expect(customizeTitle()).to.equal(
        'How to Apply for A Discharge Upgrade | Veterans Affairs',
      );
    });
  });
});
