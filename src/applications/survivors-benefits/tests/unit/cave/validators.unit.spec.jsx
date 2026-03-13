import { expect } from 'chai';
import {
  validateSsn,
  validateIsoDate,
  validateNamePart,
  validateText,
  validateEnum,
} from '../../../cave/validators';

describe('cave/validators', () => {
  describe('validateSsn', () => {
    it('returns null for null', () => {
      expect(validateSsn(null)).to.be.null;
    });

    it('returns null for empty string', () => {
      expect(validateSsn('')).to.be.null;
    });

    it('returns null for a valid SSN', () => {
      // 123456789 and 123-45-6789 are explicitly rejected by isValidSSN
      expect(validateSsn('234-56-7891')).to.be.null;
    });

    it('returns an error for too few digits', () => {
      expect(validateSsn('12345')).to.be.a('string');
    });

    it('returns an error for too many digits', () => {
      expect(validateSsn('1234567890')).to.be.a('string');
    });

    it('returns an error for non-numeric characters', () => {
      expect(validateSsn('ABCDEFGHI')).to.be.a('string');
    });

    it('error message mentions Social Security number', () => {
      expect(validateSsn('bad')).to.include('Social Security number');
    });
  });

  describe('validateIsoDate', () => {
    it('returns null for null', () => {
      expect(validateIsoDate(null)).to.be.null;
    });

    it('returns null for empty string', () => {
      expect(validateIsoDate('')).to.be.null;
    });

    it('returns null for a valid ISO date', () => {
      expect(validateIsoDate('1980-03-15')).to.be.null;
    });

    it('returns an error for an invalid date', () => {
      expect(validateIsoDate('not-a-date')).to.be.a('string');
    });

    it('returns an error for a date with invalid month', () => {
      expect(validateIsoDate('1980-13-01')).to.be.a('string');
    });

    it('uses the provided label in the error message', () => {
      expect(validateIsoDate('bad', 'date of birth')).to.include(
        'date of birth',
      );
    });

    it('uses "date" as default label', () => {
      expect(validateIsoDate('bad')).to.include('date');
    });
  });

  describe('validateNamePart', () => {
    it('returns null for null', () => {
      expect(validateNamePart(null)).to.be.null;
    });

    it('returns null for empty string', () => {
      expect(validateNamePart('')).to.be.null;
    });

    it('returns null for a valid name', () => {
      expect(validateNamePart('John')).to.be.null;
    });

    it('returns an error for a name with numbers', () => {
      expect(validateNamePart('J0hn123')).to.be.a('string');
    });

    it('uses the provided label in the error message', () => {
      expect(validateNamePart('123', 'first name')).to.include('first name');
    });

    it('uses "name" as default label', () => {
      expect(validateNamePart('123')).to.include('name');
    });
  });

  describe('validateText', () => {
    it('returns null for null', () => {
      expect(validateText(null)).to.be.null;
    });

    it('returns null for empty string', () => {
      expect(validateText('')).to.be.null;
    });

    it('returns null for valid text within default limits', () => {
      expect(validateText('hello')).to.be.null;
    });

    it('returns null when text meets min exactly', () => {
      expect(validateText('abc', { min: 3 })).to.be.null;
    });

    it('returns an error when text is shorter than min', () => {
      expect(validateText('ab', { min: 3 })).to.be.a('string');
    });

    it('error for min violation mentions the min count', () => {
      expect(validateText('ab', { min: 3 })).to.include('3');
    });

    it('returns null when text meets max exactly', () => {
      expect(validateText('abc', { max: 3 })).to.be.null;
    });

    it('returns an error when text exceeds max', () => {
      expect(validateText('abcd', { max: 3 })).to.be.a('string');
    });

    it('error for max violation mentions the max count', () => {
      expect(validateText('abcd', { max: 3 })).to.include('3');
    });

    it('uses the provided label in error messages', () => {
      expect(validateText('ab', { label: 'Description', min: 3 })).to.include(
        'Description',
      );
    });

    it('trims text before measuring length', () => {
      // 'ab   ' trims to 'ab', which is under min 3
      expect(validateText('ab   ', { min: 3 })).to.be.a('string');
    });
  });

  describe('validateEnum', () => {
    const options = ['army', 'navy', 'airForce'];

    it('returns null for null', () => {
      expect(validateEnum(null, options)).to.be.null;
    });

    it('returns null for empty string', () => {
      expect(validateEnum('', options)).to.be.null;
    });

    it('returns null for a value in the allowed array', () => {
      expect(validateEnum('army', options)).to.be.null;
    });

    it('returns an error for a value not in the allowed array', () => {
      expect(validateEnum('coastGuard', options)).to.be.a('string');
    });

    it('works with a Set as the allowed collection', () => {
      const set = new Set(options);
      expect(validateEnum('army', set)).to.be.null;
      expect(validateEnum('coastGuard', set)).to.be.a('string');
    });

    it('uses the provided label in the error message', () => {
      expect(validateEnum('bad', options, 'branch')).to.include('branch');
    });

    it('uses "value" as default label', () => {
      expect(validateEnum('bad', options)).to.include('value');
    });
  });
});
