// Dependencies.
import { expect } from 'chai';
// Relative imports.
import {
  capitalize,
  getCurrentAcademicYear,
  normalizeResponse,
  titleCase,
} from '.';

describe('Yellow Ribbon helpers', () => {
  describe('`capitalize`', () => {
    it('should capitalize university names', () => {
      const name = 'colorado UNIVERSITY';

      expect(capitalize(name)).to.equal('Colorado University');
    });
  });

  describe('titleCase', () => {
    it('should capitalize the first and last word regardless of their inclusion in the TITLE_CASE_NONCAPITALIZED_WORDS set', () => {
      expect(titleCase('the university of architecture')).to.equal(
        'The University of Architecture',
      );
    });

    it('should not capitalize any words included in TITLE_CASE_NONCAPITALIZED_WORDS in the middle', () => {
      expect(titleCase('the university of the arts')).to.equal(
        'The University of the Arts',
      );
    });

    it('should capitalize a single word', () => {
      expect(titleCase('word')).to.equal('Word');
    });

    it('should return an empty string when provided with an empty string', () => {
      expect(titleCase('')).to.equal('');
    });

    it('should capitalize the first and last words in a string of only TITLE_CASE_NONCAPITALIZED_WORDS', () => {
      expect(titleCase('an and the')).to.equal('An and The');
    });

    it('should properly title case mixed case input', () => {
      expect(titleCase('unIVERsity oF cAlifORniA bErkEley')).to.equal(
        'University of California Berkeley',
      );
    });

    it('should convert an all-uppercase string to title case', () => {
      expect(titleCase('THE UNIVERSITY OF CALIFORNIA BERKELEY')).to.equal(
        'The University of California Berkeley',
      );
    });

    it('should trim and properly title case strings with extra spaces', () => {
      expect(titleCase('  the university of california berkeley  ')).to.equal(
        'The University of California Berkeley',
      );
    });

    it('should correctly handle hyphenated words', () => {
      expect(titleCase('university of california-berkeley')).to.equal(
        'University of California-Berkeley',
      );
    });
  });

  describe('`normalizeResponse`', () => {
    it('should return what we expect', () => {
      const response = {
        data: [
          {
            id: '1',
            attributes: { name: 'colorado university' },
            type: 'school',
          },
        ],
        meta: {
          count: 227,
        },
      };

      expect(normalizeResponse(response)).to.deep.equal({
        results: [
          {
            id: '1',
            name: 'colorado university',
            type: 'school',
          },
        ],
        totalResults: 227,
      });
    });
  });

  describe('getCurrentAcademicYear', () => {
    it('returns Academic Year "2023 to 2024" if the current date is before August 2024', () => {
      // Date() arguments are Year, Month, Day where Month = 0 is January
      const testDate = new Date(2024, 6, 31);
      expect(getCurrentAcademicYear(testDate)).to.equal('2023 to 2024');
    });

    it('returns Academic Year "2024 to 2025" if the current date is on or after August 2024', () => {
      const testDate = new Date(2024, 7, 1);
      expect(getCurrentAcademicYear(testDate)).to.equal('2024 to 2025');
    });
  });
});
