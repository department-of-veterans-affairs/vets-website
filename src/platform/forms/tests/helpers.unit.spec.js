import sinon from 'sinon';

import { isActivePage, isInProgressPath } from '../helpers';

describe('Helpers unit tests', () => {
  describe('isInProgress', () => {
    describe('default behavior', () => {
      it('returns false when passed a standard non-form path', () => {
        expect(isInProgressPath('introduction')).toBe(false);
        expect(isInProgressPath('confirmation')).toBe(false);
        expect(isInProgressPath('form-saved')).toBe(false);
        expect(isInProgressPath('error')).toBe(false);
      });
      it('returns true when passed a path that is a form path', () => {
        expect(isInProgressPath('id-page')).toBe(true);
      });
    });
    describe('when given additional non-form paths', () => {
      const additionalSafePaths = ['id-page'];
      it('returns false when passed a standard non-form path', () => {
        expect(isInProgressPath('introduction', additionalSafePaths)).toBe(
          false,
        );
        expect(isInProgressPath('confirmation', additionalSafePaths)).toBe(
          false,
        );
        expect(isInProgressPath('form-saved', additionalSafePaths)).toBe(false);
        expect(isInProgressPath('error', additionalSafePaths)).toBe(false);
      });
      it('returns false when passed a path that is one of the additional non-form paths', () => {
        expect(isInProgressPath('id-page', additionalSafePaths)).toBe(false);
      });
      it('returns true when passed a path that is a form path', () => {
        expect(isInProgressPath('page-one', additionalSafePaths)).toBe(true);
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

      expect(result).toBe(true);
    });
    it('false with mismatched data', () => {
      const page = {
        depends: { testData: 'Y' },
      };
      const data = {
        testData: 'N',
      };

      const result = isActivePage(page, data);

      expect(result).toBe(false);
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

      expect(result).toBe(true);
      expect(matcher.calledWith(data)).toBe(true);
    });
    it('matches against array', () => {
      const page = {
        depends: [{ testData: 'N' }, { testData: 'Y' }],
      };
      const data = {
        testData: 'Y',
      };

      const result = isActivePage(page, data);

      expect(result).toBe(true);
    });
  });
});
