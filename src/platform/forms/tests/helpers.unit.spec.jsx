import { expect } from 'chai';
import sinon from 'sinon';

import { isActivePage, isInProgressPath } from '../helpers';
import {
  VA_FORM_IDS,
  getAllFormLinks,
  memoizedGetFormLink,
} from '../constants';

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

  describe('getAllFormLinks', () => {
    it('constructs form links correctly', () => {
      const mockGetAppUrl = sinon.stub().returns('testUrl');
      const formLinks = getAllFormLinks(mockGetAppUrl);

      expect(formLinks[VA_FORM_IDS.FORM_10_10EZ]).to.equal('testUrl/');
    });

    it('throws an error if getAppUrlImpl is not provided', () => {
      expect(() => getAllFormLinks()).to.throw(
        'getAppUrlImpl is required as an argument of getAllFormLinks()',
      );
    });
  });

  describe('memoizedGetFormLink', () => {
    it('returns the correct link for a form ID', () => {
      const getFormLink = memoizedGetFormLink(sinon.stub().returns('testUrl'));
      const link = getFormLink(VA_FORM_IDS.FORM_10_10EZ);

      expect(link).to.equal('testUrl/');
    });

    it('memoizes the form links', () => {
      const mockGetAppUrl = sinon.stub().returns('testUrl');
      const getFormLink = memoizedGetFormLink(mockGetAppUrl);

      getFormLink(VA_FORM_IDS.FORM_10_10EZ);

      const firstCallCount = mockGetAppUrl.callCount;

      getFormLink(VA_FORM_IDS.FORM_10_10EZ);

      // shouldn't have called getAppUrlImpl again
      expect(mockGetAppUrl.callCount === firstCallCount).to.be.true;
    });

    it('returns null for an unknown form ID', () => {
      const getFormLink = memoizedGetFormLink(sinon.stub().returnsArg(0));
      const link = getFormLink('unknown-form-id');

      expect(link).to.be.null;
    });
  });
});
