import * as platformHelpers from '@department-of-veterans-affairs/platform-forms-system/helpers';
import * as platformSelectors from '@department-of-veterans-affairs/platform-forms-system/selectors';
import { expect } from 'chai';
import sinon from 'sinon';
import { getFileSize } from '../../utils/helpers';
import {
  getPageKeysForReview,
  removeDuplicatesByChapterAndPageKey,
} from '../../utils/reviewPageHelper';

// Create sandbox for sinon stubs
const sandbox = sinon.createSandbox();

// Mock platform helpers
sandbox.stub(platformHelpers, 'getActiveExpandedPages').returns([]);
sandbox.stub(platformSelectors, 'getViewedPages').returns(new Set());

// Helper function for date formatting
const formatDate = (date, format) => {
  const d = new Date(date);
  if (format === 'long') {
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
  return date;
};

const convertDate = dob => {
  if (dob) {
    const bDay = dob.split('-');
    const date = `${bDay[1]}/${bDay[2]}/${bDay[0]}`;
    return formatDate(date, 'long');
  }
  return null;
};

// Helper function for masking SSN
const maskSocial = ssn => {
  if (!ssn) return null;
  // Remove any non-numeric characters
  const cleanSSN = ssn.replace(/\D/g, '');
  if (cleanSSN.length !== 9) return null;
  return `•••-••-${cleanSSN.slice(-4)}`;
};

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
    it('should remove duplicates based on chapter and page keys', () => {
      const input = [
        { chapterKey: 'ch1', pageKey: 'page1', data: 'first' },
        { chapterKey: 'ch1', pageKey: 'page2', data: 'second' },
        { chapterKey: 'ch1', pageKey: 'page1', data: 'duplicate' },
        { chapterKey: 'ch2', pageKey: 'page1', data: 'different chapter' },
      ];

      const result = removeDuplicatesByChapterAndPageKey(input);
      expect(result).to.have.lengthOf(3);
      expect(result[0]).to.deep.equal({
        chapterKey: 'ch1',
        pageKey: 'page1',
        data: 'first',
      });
      expect(result[1]).to.deep.equal({
        chapterKey: 'ch1',
        pageKey: 'page2',
        data: 'second',
      });
      expect(result[2]).to.deep.equal({
        chapterKey: 'ch2',
        pageKey: 'page1',
        data: 'different chapter',
      });
    });

    it('should handle empty array', () => {
      const result = removeDuplicatesByChapterAndPageKey([]);
      expect(result).to.be.an('array').that.is.empty;
    });

    it('should handle array with no duplicates', () => {
      const input = [
        { chapterKey: 'ch1', pageKey: 'page1' },
        { chapterKey: 'ch2', pageKey: 'page2' },
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

  describe('Date Formatting', () => {
    it('should convert YYYY-MM-DD to long date format', () => {
      expect(convertDate('2024-03-11')).to.equal('March 11, 2024');
    });

    it('should handle single digit month and day', () => {
      expect(convertDate('2024-01-05')).to.equal('January 5, 2024');
    });

    it('should handle last day of month', () => {
      expect(convertDate('2024-12-31')).to.equal('December 31, 2024');
    });

    it('should handle leap year date', () => {
      expect(convertDate('2024-02-29')).to.equal('February 29, 2024');
    });

    it('should return null for invalid input', () => {
      expect(convertDate('')).to.be.null;
      expect(convertDate(null)).to.be.null;
      expect(convertDate(undefined)).to.be.null;
    });
  });

  describe('SSN Masking', () => {
    it('should mask SSN showing only last 4 digits', () => {
      expect(maskSocial('123456789')).to.equal('•••-••-6789');
    });

    it('should handle SSN with dashes', () => {
      expect(maskSocial('123-45-6789')).to.equal('•••-••-6789');
    });

    it('should handle SSN with spaces', () => {
      expect(maskSocial('123 45 6789')).to.equal('•••-••-6789');
    });

    it('should return null for invalid SSN length', () => {
      expect(maskSocial('12345')).to.be.null;
      expect(maskSocial('1234567890')).to.be.null;
    });

    it('should return null for non-numeric SSN', () => {
      expect(maskSocial('abc-de-fghi')).to.be.null;
    });

    it('should return null for invalid input', () => {
      expect(maskSocial('')).to.be.null;
      expect(maskSocial(null)).to.be.null;
      expect(maskSocial(undefined)).to.be.null;
    });
  });

  afterEach(() => {
    sandbox.restore();
  });
});
