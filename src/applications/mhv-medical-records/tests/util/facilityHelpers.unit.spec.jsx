import { expect } from 'chai';
import { formatFacilityList } from '../../util/facilityHelpers';

describe('facilityHelpers', () => {
  describe('formatFacilityList', () => {
    it('should return empty string for null input', () => {
      expect(formatFacilityList(null)).to.equal('');
    });

    it('should return empty string for undefined input', () => {
      expect(formatFacilityList(undefined)).to.equal('');
    });

    it('should return empty string for empty array', () => {
      expect(formatFacilityList([])).to.equal('');
    });

    it('should return single facility name for one facility', () => {
      const facilities = ['VA Western New York health care'];
      expect(formatFacilityList(facilities)).to.equal(
        'VA Western New York health care',
      );
    });

    it('should format two facilities with "and"', () => {
      const facilities = [
        'VA Western New York health care',
        'VA Pacific Islands health care',
      ];
      expect(formatFacilityList(facilities)).to.equal(
        'VA Western New York health care and VA Pacific Islands health care',
      );
    });

    it('should format three facilities with commas and "and"', () => {
      const facilities = [
        'VA Western New York health care',
        'VA Pacific Islands health care',
        'VA Central Ohio health care',
      ];
      expect(formatFacilityList(facilities)).to.equal(
        'VA Western New York health care, VA Pacific Islands health care, and VA Central Ohio health care',
      );
    });

    it('should format four or more facilities with commas and "and"', () => {
      const facilities = [
        'VA Western New York health care',
        'VA Pacific Islands health care',
        'VA Central Ohio health care',
        'VA Southern Nevada health care',
      ];
      expect(formatFacilityList(facilities)).to.equal(
        'VA Western New York health care, VA Pacific Islands health care, VA Central Ohio health care, and VA Southern Nevada health care',
      );
    });

    it('should handle facility names with special characters', () => {
      const facilities = [
        'VA St. Louis health care',
        "VA O'Malley Regional Medical Center",
      ];
      expect(formatFacilityList(facilities)).to.equal(
        "VA St. Louis health care and VA O'Malley Regional Medical Center",
      );
    });
  });
});
