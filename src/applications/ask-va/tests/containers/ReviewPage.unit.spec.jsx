import * as platformHelpers from '@department-of-veterans-affairs/platform-forms-system/helpers';
import * as platformSelectors from '@department-of-veterans-affairs/platform-forms-system/selectors';
import { expect } from 'chai';
import sinon from 'sinon';
import { getFileSize } from '../../utils/helpers';
import {
  getPageKeysForReview,
  removeDuplicatesByChapterAndPageKey,
} from '../../utils/reviewPageHelper';
import {
  getSchoolString,
  getYesOrNoFromBool,
} from '../../utils/reviewPageUtils';

// Create sandbox for sinon stubs
const sandbox = sinon.createSandbox();

// Mock platform helpers
sandbox.stub(platformHelpers, 'getActiveExpandedPages').returns([]);
sandbox.stub(platformSelectors, 'getViewedPages').returns(new Set());

describe('Helper Functions', () => {
  describe('getFileSize', () => {
    it('should format bytes correctly', () => {
      expect(getFileSize(100)).to.equal('100 B');
    });

    it('should format kilobytes correctly', () => {
      expect(getFileSize(1500)).to.equal('1 KB');
      expect(getFileSize(2048)).to.equal('2 KB');
    });

    it('should format megabytes correctly', () => {
      expect(getFileSize(1500000)).to.equal('1.5 MB');
      expect(getFileSize(2048000)).to.equal('2.0 MB');
    });

    it('should handle edge cases', () => {
      expect(getFileSize(0)).to.equal('0 B');
      expect(getFileSize(999)).to.equal('999 B');
      expect(getFileSize(1000)).to.equal('1 KB');
      expect(getFileSize(999999)).to.equal('999 KB');
      expect(getFileSize(1000000)).to.equal('1.0 MB');
    });
  });

  describe('removeDuplicatesByChapterAndPageKey', () => {
    it('should remove duplicates based on chapter and page key', () => {
      const input = [
        { chapter: 'ch1', pageKey: 'page1' },
        { chapter: 'ch1', pageKey: 'page1' },
        { chapter: 'ch2', pageKey: 'page2' },
      ];
      const result = removeDuplicatesByChapterAndPageKey(input);
      expect(result).to.have.lengthOf(2);
      expect(result).to.deep.equal([
        { chapter: 'ch1', pageKey: 'page1' },
        { chapter: 'ch2', pageKey: 'page2' },
      ]);
    });

    it('should handle empty input', () => {
      const result = removeDuplicatesByChapterAndPageKey([]);
      expect(result).to.have.lengthOf(0);
    });

    it('should handle input with no duplicates', () => {
      const input = [
        { chapter: 'ch1', pageKey: 'page1' },
        { chapter: 'ch2', pageKey: 'page2' },
      ];
      const result = removeDuplicatesByChapterAndPageKey(input);
      expect(result).to.have.lengthOf(2);
      expect(result).to.deep.equal(input);
    });
  });

  describe('getPageKeysForReview', () => {
    it('should extract page keys from config', () => {
      const config = {
        chapters: {
          chapter1: {
            pages: {
              page1: { title: 'Page 1' },
              page2: { title: 'Page 2' },
            },
          },
          chapter2: {
            pages: {
              page3: { title: 'Page 3' },
            },
          },
        },
      };

      const result = getPageKeysForReview(config);
      expect(result).to.deep.equal(['page1', 'page2', 'page3']);
    });

    it('should handle empty config', () => {
      const config = {
        chapters: {},
      };
      const result = getPageKeysForReview(config);
      expect(result).to.deep.equal([]);
    });

    it('should handle config with empty chapters', () => {
      const config = {
        chapters: {
          chapter1: {
            pages: {},
          },
          chapter2: {
            pages: {},
          },
        },
      };
      const result = getPageKeysForReview(config);
      expect(result).to.deep.equal([]);
    });
  });

  describe('getYesOrNoFromBool', () => {
    it('should return "Yes" for true', () => {
      expect(getYesOrNoFromBool(true)).to.equal('Yes');
    });

    it('should return "No" for false', () => {
      expect(getYesOrNoFromBool(false)).to.equal('No');
    });
  });

  describe('getSchoolString', () => {
    it('should combine school code and name', () => {
      const schoolCode = '12345';
      const schoolName = 'Test University';
      expect(getSchoolString(schoolCode, schoolName)).to.equal(
        '12345 - Test University',
      );
    });

    it('should return null if school name is missing', () => {
      const schoolCode = '12345';
      expect(getSchoolString(schoolCode)).to.be.null;
    });

    it('should return null if school code is missing', () => {
      const schoolName = 'Test University';
      expect(getSchoolString(undefined, schoolName)).to.be.null;
    });

    it('should return null if either value is null', () => {
      expect(getSchoolString('12345', null)).to.be.null;
      expect(getSchoolString(null, 'Test University')).to.be.null;
    });
  });

  afterEach(() => {
    sandbox.restore();
  });
});
