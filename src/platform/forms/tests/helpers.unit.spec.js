import { expect } from 'chai';
import sinon from 'sinon';

import { isActivePage, isInProgress } from '../helpers';

describe('Helpers unit tests', () => {
  describe('isInProgress', () => {
    describe('default behavior', () => {
      it('returns false when passed a standard non-form-page path', () => {
        expect(isInProgress('introduction')).to.be.false;
        expect(isInProgress('confirmation')).to.be.false;
        expect(isInProgress('form-saved')).to.be.false;
        expect(isInProgress('error')).to.be.false;
      });
      it('returns true when passed a path that is not a non-form path', () => {
        expect(isInProgress('id-page')).to.be.true;
      });
    });
  });

  describe('isActivePage', () => {
    it('matches against data', () => {
      const page = {
        depends: { testData: 'Y' },
      };
      const data = {
        testData: 'Y',
      };

      const result = isActivePage(page, data);

      expect(result).to.be.true;
    });
    it('false with mismatched data', () => {
      const page = {
        depends: { testData: 'Y' },
      };
      const data = {
        testData: 'N',
      };

      const result = isActivePage(page, data);

      expect(result).to.be.false;
    });
    it('matches using function', () => {
      const matcher = sinon.stub().returns(true);
      const page = {
        depends: matcher,
      };
      const data = {
        testData: 'Y',
      };

      const result = isActivePage(page, data);

      expect(result).to.be.true;
      expect(matcher.calledWith(data)).to.be.true;
    });
    it('matches against array', () => {
      const page = {
        depends: [{ testData: 'N' }, { testData: 'Y' }],
      };
      const data = {
        testData: 'Y',
      };

      const result = isActivePage(page, data);

      expect(result).to.be.true;
    });
  });
});
