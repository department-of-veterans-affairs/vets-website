import { expect } from 'chai';
import {
  formatDate,
  formatProviderName,
  formatUserFullName,
  formatUserNameForFilename,
  formatDob,
  formatList,
  validateField,
  validateFieldWithName,
  generateTimestamp,
  FIELD_NONE_NOTED,
} from '../../../util/rxExport/formatters';

describe('Export Formatters', () => {
  describe('formatDate', () => {
    it('should format a valid date', () => {
      const result = formatDate('2024-01-15');
      expect(result).to.equal('January 15, 2024');
    });

    it('should return default message for falsy value', () => {
      expect(formatDate(null)).to.equal(FIELD_NONE_NOTED);
      expect(formatDate(undefined)).to.equal(FIELD_NONE_NOTED);
      expect(formatDate('')).to.equal(FIELD_NONE_NOTED);
    });

    it('should return custom no-date message', () => {
      const result = formatDate(null, undefined, 'Date not available');
      expect(result).to.equal('Date not available');
    });

    it('should prepend message when dateWithMessage is provided', () => {
      const result = formatDate(
        '2024-01-15',
        undefined,
        null,
        'Last filled on ',
      );
      expect(result).to.equal('Last filled on January 15, 2024');
    });
  });

  describe('validateField', () => {
    it('should return value when present', () => {
      expect(validateField('test')).to.equal('test');
      expect(validateField(0)).to.equal(0);
      expect(validateField(123)).to.equal(123);
    });

    it('should return default message for empty values', () => {
      expect(validateField(null)).to.equal(FIELD_NONE_NOTED);
      expect(validateField(undefined)).to.equal(FIELD_NONE_NOTED);
      expect(validateField('')).to.equal(FIELD_NONE_NOTED);
    });
  });

  describe('validateFieldWithName', () => {
    it('should return value when present', () => {
      expect(validateFieldWithName('Test Field', 'value')).to.equal('value');
      expect(validateFieldWithName('Count', 0)).to.equal(0);
    });

    it('should return contextual message for empty values', () => {
      expect(validateFieldWithName('Instructions', null)).to.equal(
        'Instructions not available',
      );
      expect(validateFieldWithName('Facility', undefined)).to.equal(
        'Facility not available',
      );
    });
  });

  describe('formatProviderName', () => {
    it('should format full name', () => {
      expect(formatProviderName('John', 'Doe')).to.equal('John Doe');
    });

    it('should handle first name only', () => {
      expect(formatProviderName('John', null)).to.equal('John');
      expect(formatProviderName('John', '')).to.equal('John');
    });

    it('should handle last name only', () => {
      expect(formatProviderName(null, 'Doe')).to.equal('Doe');
      expect(formatProviderName('', 'Doe')).to.equal('Doe');
    });

    it('should return default message when no name', () => {
      expect(formatProviderName(null, null)).to.equal(
        'Provider name not available',
      );
      expect(formatProviderName('', '')).to.equal(
        'Provider name not available',
      );
    });
  });

  describe('formatUserFullName', () => {
    it('should format full name as Last, First', () => {
      expect(formatUserFullName({ first: 'John', last: 'Doe' })).to.equal(
        'Doe, John',
      );
    });

    it('should handle last name only', () => {
      expect(formatUserFullName({ last: 'Doe' })).to.equal('Doe');
      expect(formatUserFullName({ first: '', last: 'Doe' })).to.equal('Doe');
    });

    it('should handle null/undefined userName', () => {
      expect(formatUserFullName(null)).to.equal(' ');
      expect(formatUserFullName(undefined)).to.equal(' ');
    });

    it('should handle empty object', () => {
      expect(formatUserFullName({})).to.equal(' ');
    });
  });

  describe('formatUserNameForFilename', () => {
    it('should format name with hyphen', () => {
      expect(
        formatUserNameForFilename({ first: 'John', last: 'Doe' }),
      ).to.equal('John-Doe');
    });

    it('should handle last name only', () => {
      expect(formatUserNameForFilename({ last: 'Doe' })).to.equal('Doe');
    });

    it('should return unknown for null/undefined', () => {
      expect(formatUserNameForFilename(null)).to.equal('unknown');
      expect(formatUserNameForFilename(undefined)).to.equal('unknown');
    });
  });

  describe('formatDob', () => {
    it('should format date of birth with prefix', () => {
      const result = formatDob('1990-06-15');
      expect(result).to.equal('Date of birth: June 15, 1990');
    });
  });

  describe('formatList', () => {
    it('should join multiple items with period', () => {
      expect(formatList(['Rash', 'Hives', 'Swelling'])).to.equal(
        'Rash. Hives. Swelling',
      );
    });

    it('should return single item as string', () => {
      expect(formatList(['Rash'])).to.equal('Rash');
    });

    it('should return default message for empty array', () => {
      expect(formatList([])).to.equal(FIELD_NONE_NOTED);
    });

    it('should return custom empty message', () => {
      expect(formatList([], 'No items')).to.equal('No items');
    });

    it('should handle non-array values', () => {
      expect(formatList(null)).to.equal(FIELD_NONE_NOTED);
      expect(formatList('string')).to.equal(FIELD_NONE_NOTED);
    });
  });

  describe('generateTimestamp', () => {
    it('should return a string timestamp', () => {
      const result = generateTimestamp();
      expect(result).to.be.a('string');
      // Should match pattern like "1-15-2024_123456pm"
      expect(result).to.match(/^\d{1,2}-\d{1,2}-\d{4}_\d+[ap]m$/);
    });
  });
});
