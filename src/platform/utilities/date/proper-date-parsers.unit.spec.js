import { expect } from 'chai';
import {
  parseDateSafely,
  parseVistaDateSafely,
  parseProblemDateTimeSafely,
  parseDateFieldSafely,
  isValidDateString,
  parseVeteranDobSafely,
} from '../proper-date-parsers';

describe('Proper Date Parsers', () => {
  describe('parseDateSafely', () => {
    it('should return null for invalid inputs', () => {
      expect(parseDateSafely(null)).to.be.null;
      expect(parseDateSafely(undefined)).to.be.null;
      expect(parseDateSafely('')).to.be.null;
      expect(parseDateSafely(123)).to.be.null;
      expect(parseDateSafely('invalid-date')).to.be.null;
    });

    it('should parse valid ISO date strings', () => {
      const result = parseDateSafely('2023-06-15');
      expect(result).to.be.instanceOf(Date);
      expect(result.getFullYear()).to.equal(2023);
      expect(result.getMonth()).to.equal(5); // 0-based months
      expect(result.getDate()).to.equal(15);
    });

    it('should parse dates with custom format', () => {
      const result = parseDateSafely('15/06/2023', 'dd/MM/yyyy');
      expect(result).to.be.instanceOf(Date);
      expect(result.getFullYear()).to.equal(2023);
      expect(result.getMonth()).to.equal(5);
      expect(result.getDate()).to.equal(15);
    });

    it('should return null for invalid format combinations', () => {
      const result = parseDateSafely('2023-06-15', 'MM/dd/yyyy');
      expect(result).to.be.null;
    });
  });

  describe('parseVistaDateSafely', () => {
    it('should parse Vista date format', () => {
      const result = parseVistaDateSafely('06/15/2023');
      expect(result).to.be.instanceOf(Date);
      expect(result.getFullYear()).to.equal(2023);
      expect(result.getMonth()).to.equal(5);
      expect(result.getDate()).to.equal(15);
    });

    it('should parse Vista datetime format', () => {
      const result = parseVistaDateSafely('06/15/2023@14:30', true);
      expect(result).to.be.instanceOf(Date);
      expect(result.getHours()).to.equal(14);
      expect(result.getMinutes()).to.equal(30);
    });

    it('should return null for invalid Vista dates', () => {
      expect(parseVistaDateSafely('invalid')).to.be.null;
      expect(parseVistaDateSafely('13/32/2023')).to.be.null;
    });
  });

  describe('parseProblemDateTimeSafely', () => {
    it('should parse problem datetime format', () => {
      const result = parseProblemDateTimeSafely('Thu Apr 07 00:00:00 PDT 2005');
      expect(result).to.be.instanceOf(Date);
      expect(result.getFullYear()).to.equal(2005);
      expect(result.getMonth()).to.equal(3); // April = 3 in 0-based months
      expect(result.getDate()).to.equal(7);
    });

    it('should return null for invalid problem datetime strings', () => {
      expect(parseProblemDateTimeSafely('invalid format')).to.be.null;
      expect(parseProblemDateTimeSafely('')).to.be.null;
      expect(parseProblemDateTimeSafely(null)).to.be.null;
    });
  });

  describe('parseDateFieldSafely', () => {
    it('should parse date field object with all values', () => {
      const dateField = {
        year: { value: '2023' },
        month: { value: '06' },
        day: { value: '15' }
      };
      const result = parseDateFieldSafely(dateField);
      expect(result).to.be.instanceOf(Date);
      expect(result.getFullYear()).to.equal(2023);
      expect(result.getMonth()).to.equal(5);
      expect(result.getDate()).to.equal(15);
    });

    it('should handle missing month with default', () => {
      const dateField = {
        year: { value: '2023' },
        month: { value: 'XX' },
        day: { value: '15' }
      };
      const result = parseDateFieldSafely(dateField);
      expect(result).to.be.instanceOf(Date);
      expect(result.getMonth()).to.equal(0); // January default
    });

    it('should handle missing day with default', () => {
      const dateField = {
        year: { value: '2023' },
        month: { value: '06' },
        day: { value: 'XX' }
      };
      const result = parseDateFieldSafely(dateField);
      expect(result).to.be.instanceOf(Date);
      expect(result.getDate()).to.equal(1); // First day default
    });

    it('should return null for missing year', () => {
      const dateField = {
        month: { value: '06' },
        day: { value: '15' }
      };
      expect(parseDateFieldSafely(dateField)).to.be.null;
    });

    it('should return null for invalid input', () => {
      expect(parseDateFieldSafely(null)).to.be.null;
      expect(parseDateFieldSafely('not an object')).to.be.null;
    });
  });

  describe('isValidDateString', () => {
    it('should return true for valid date strings', () => {
      expect(isValidDateString('2023-06-15')).to.be.true;
      expect(isValidDateString('June 15, 2023')).to.be.true;
      expect(isValidDateString('2023-06-15T10:30:00Z')).to.be.true;
    });

    it('should return false for invalid date strings', () => {
      expect(isValidDateString('invalid-date')).to.be.false;
      expect(isValidDateString('')).to.be.false;
      expect(isValidDateString(null)).to.be.false;
      expect(isValidDateString(undefined)).to.be.false;
      expect(isValidDateString(123)).to.be.false;
    });
  });

  describe('parseVeteranDobSafely', () => {
    it('should parse valid veteran DOB', () => {
      const result = parseVeteranDobSafely('1990-05-15');
      expect(result).to.be.instanceOf(Date);
      expect(result.getFullYear()).to.equal(1990);
    });

    it('should return null for dates before 1900', () => {
      const result = parseVeteranDobSafely('1899-05-15');
      expect(result).to.be.null;
    });

    it('should return null for future dates', () => {
      const futureYear = new Date().getFullYear() + 1;
      const result = parseVeteranDobSafely(`${futureYear}-05-15`);
      expect(result).to.be.null;
    });

    it('should return null for invalid dates', () => {
      expect(parseVeteranDobSafely('invalid')).to.be.null;
      expect(parseVeteranDobSafely(null)).to.be.null;
    });
  });
});