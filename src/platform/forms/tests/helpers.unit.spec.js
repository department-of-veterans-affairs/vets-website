import { expect } from 'chai';
import sinon from 'sinon';

import { isActivePage, isInProgressPath } from '../helpers';

describe('Helpers unit tests', () => {
  describe('isInProgress', () => {
    describe('default behavior', () => {
      it('returns false when passed a standard non-form path', () => {
        expect(isInProgressPath('introduction')).to.be.false;
        expect(isInProgressPath('confirmation')).to.be.false;
        expect(isInProgressPath('form-saved')).to.be.false;
        expect(isInProgressPath('error')).to.be.false;
      });
      it('returns true when passed a path that is a form path', () => {
        expect(isInProgressPath('id-page')).to.be.true;
      });
    });
    describe('when given additional non-form paths', () => {
      const additionalSafePaths = ['id-page'];
      it('returns false when passed a standard non-form path', () => {
        expect(isInProgressPath('introduction', additionalSafePaths)).to.be
          .false;
        expect(isInProgressPath('confirmation', additionalSafePaths)).to.be
          .false;
        expect(isInProgressPath('form-saved', additionalSafePaths)).to.be.false;
        expect(isInProgressPath('error', additionalSafePaths)).to.be.false;
      });
      it('returns false when passed a path that is one of the additional non-form paths', () => {
        expect(isInProgressPath('id-page', additionalSafePaths)).to.be.false;
      });
      it('returns true when passed a path that is a form path', () => {
        expect(isInProgressPath('page-one', additionalSafePaths)).to.be.true;
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
