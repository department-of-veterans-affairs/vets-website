import { expect } from 'chai';
import { swapPrefix } from '../../utilities/shared-results-content-utils';

describe('shared results utilities', () => {
  describe('swapPrefix', () => {
    it('should return an empty string when the string does not contain the "from" value', () => {
      expect(swapPrefix('SOMETHING_SC', 'CARD', 'TITLE')).to.equal('');
    });

    describe('when keepUnderscore is false', () => {
      it('swaps the prefix and removes the underscore', () => {
        expect(swapPrefix('CARD_SC', 'CARD', 'TITLE', false)).to.equal(
          'TITLESC',
        );
      });
    });

    describe('when keepUnderscore is true', () => {
      it('swaps the prefix and keeps the underscore', () => {
        expect(swapPrefix('CARD_SC', 'CARD', 'TITLE', true)).to.equal(
          'TITLE_SC',
        );
      });
    });
  });
});
