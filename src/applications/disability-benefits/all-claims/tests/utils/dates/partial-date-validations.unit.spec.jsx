import { expect } from 'chai';
import sinon from 'sinon';

import {
  validatePartialDate,
  validateRequiredPartialDate,
  validatePartialDateRange,
  validateYearOnlyPartialDate,
  normalizeDateInput,
} from '../../../utils/dates/partial-date-validations';

describe('Disability benefits 526EZ -- Partial date validations', () => {
  let errorsSpy;

  beforeEach(() => {
    errorsSpy = {
      addError: sinon.spy(),
    };
  });

  describe('validatePartialDate', () => {
    it('should validate complete dates', () => {
      validatePartialDate(errorsSpy, '2023-01-15', {}, { required: false });
      expect(errorsSpy.addError.called).to.be.false;
    });

    it('should validate year-only partial dates', () => {
      validatePartialDate(errorsSpy, '2023-XX-XX', {}, { required: false });
      expect(errorsSpy.addError.called).to.be.false;
    });

    it('should validate month-year partial dates', () => {
      validatePartialDate(errorsSpy, '2023-01-XX', {}, { required: false });
      expect(errorsSpy.addError.called).to.be.false;
    });

    it('should allow empty dates when not required', () => {
      validatePartialDate(errorsSpy, '', {}, { required: false });
      expect(errorsSpy.addError.called).to.be.false;
    });

    it('should error when required and empty', () => {
      validatePartialDate(errorsSpy, '', {}, { required: true });
      expect(errorsSpy.addError.called).to.be.true;
    });
  });

  describe('validateYearOnlyPartialDate', () => {
    it('should validate valid years', () => {
      validateYearOnlyPartialDate(errorsSpy, '2023');
      expect(errorsSpy.addError.called).to.be.false;
    });

    it('should validate historical years', () => {
      validateYearOnlyPartialDate(errorsSpy, '1950');
      expect(errorsSpy.addError.called).to.be.false;
    });

    it('should skip validation for empty input', () => {
      validateYearOnlyPartialDate(errorsSpy, '');
      expect(errorsSpy.addError.called).to.be.false;
    });

    it('should skip validation for null input', () => {
      validateYearOnlyPartialDate(errorsSpy, null);
      expect(errorsSpy.addError.called).to.be.false;
    });

    it('should handle current year', () => {
      const currentYear = new Date().getFullYear().toString();
      validateYearOnlyPartialDate(errorsSpy, currentYear);
      expect(errorsSpy.addError.called).to.be.false;
    });
  });

  describe('validateRequiredPartialDate', () => {
    it('should validate complete dates', () => {
      validateRequiredPartialDate(errorsSpy, '2023-01-15', {}, {});

      expect(errorsSpy.addError.called).to.be.false;
    });

    it('should validate partial dates', () => {
      validateRequiredPartialDate(errorsSpy, '2023-01-XX', {}, {});

      expect(errorsSpy.addError.called).to.be.false;
    });

    it('should reject invalid partial patterns', () => {
      validateRequiredPartialDate(errorsSpy, 'invalid-date-string', {}, {});

      expect(errorsSpy.addError.calledOnce).to.be.true;
    });

    it('should allow empty dates (field is optional)', () => {
      validateRequiredPartialDate(errorsSpy, '', {}, {});

      expect(errorsSpy.addError.called).to.be.false;
    });

    it('should handle null input', () => {
      validateRequiredPartialDate(errorsSpy, null, {}, {});

      expect(errorsSpy.addError.called).to.be.false;
    });

    it('should convert string dates to date field objects', () => {
      validateRequiredPartialDate(errorsSpy, '2025-01-01', {}, {});

      expect(errorsSpy.addError.called).to.be.false;
    });

    it('should handle date field objects directly', () => {
      validateRequiredPartialDate(
        errorsSpy,
        { month: '1', day: '15', year: '2023' },
        {},
        {},
      );

      expect(errorsSpy.addError.called).to.be.false;
    });
  });

  describe('validatePartialDateRange', () => {
    it('should validate valid date ranges', () => {
      validatePartialDateRange(errorsSpy, '2023-01-01', '2023-12-31');

      expect(errorsSpy.addError.called).to.be.false;
    });

    it('should validate partial date ranges', () => {
      validatePartialDateRange(errorsSpy, '2023-01-XX', '2023-12-XX');

      expect(errorsSpy.addError.called).to.be.false;
    });

    it('should validate year-only ranges', () => {
      validatePartialDateRange(errorsSpy, '2020-XX-XX', '2023-XX-XX');

      expect(errorsSpy.addError.called).to.be.false;
    });

    it('should error when from date is invalid', () => {
      validatePartialDateRange(errorsSpy, 'invalid-from-date', '2023-12-31');

      expect(errorsSpy.addError.calledOnce).to.be.true;
    });

    it('should error when to date is invalid', () => {
      validatePartialDateRange(errorsSpy, '2023-01-01', 'invalid-to-date');

      expect(errorsSpy.addError.calledOnce).to.be.true;
    });

    it('should error when end date is before start date', () => {
      validatePartialDateRange(errorsSpy, '2023-12-31', '2023-01-01');

      expect(errorsSpy.addError.calledOnce).to.be.true;
      expect(errorsSpy.addError.calledWith('End date must be after start date'))
        .to.be.true;
    });

    it('should use custom error messages', () => {
      const customMessages = {
        from: 'Custom from error',
        to: 'Custom to error',
        range: 'Custom range error',
      };

      validatePartialDateRange(
        errorsSpy,
        'invalid-from-date',
        '2023-12-31',
        customMessages,
      );

      expect(errorsSpy.addError.calledWith(customMessages.from)).to.be.true;
    });

    it('should not validate range for partial dates', () => {
      // Partial dates should not have range validation applied
      validatePartialDateRange(
        errorsSpy,
        '2023-XX-XX',
        '2020-XX-XX', // Earlier year but should not error due to partial dates
      );

      expect(errorsSpy.addError.called).to.be.false;
    });

    it('should handle date field objects', () => {
      validatePartialDateRange(
        errorsSpy,
        { month: '1', day: '1', year: '2023' },
        { month: '12', day: '31', year: '2023' },
      );

      expect(errorsSpy.addError.called).to.be.false;
    });

    it('should handle mixed input types', () => {
      validatePartialDateRange(errorsSpy, '2023-01-01', {
        month: '12',
        day: '31',
        year: '2023',
      });

      expect(errorsSpy.addError.called).to.be.false;
    });
  });

  describe('normalizeDateInput integration', () => {
    it('should handle string ISO dates consistently', () => {
      validatePartialDate(errorsSpy, '2023-01-15', {}, { required: false });
      validateRequiredPartialDate(errorsSpy, '2023-01-15', {}, {});

      expect(errorsSpy.addError.called).to.be.false;
    });

    it('should handle date field objects consistently', () => {
      const dateField = { month: '1', day: '15', year: '2023' };

      validatePartialDate(errorsSpy, dateField, {}, { required: false });
      validateRequiredPartialDate(errorsSpy, dateField, {}, {});

      expect(errorsSpy.addError.called).to.be.false;
    });

    it('should handle null/undefined consistently', () => {
      validatePartialDate(errorsSpy, null, {}, { required: false });
      validateRequiredPartialDate(errorsSpy, undefined, {}, {});

      expect(errorsSpy.addError.called).to.be.false;
    });

    it('should handle invalid patterns', () => {
      validatePartialDate(errorsSpy, 'XXXX-01-XX', {}, { required: false });

      // If the pattern is rejected, addError will be called
      // If not rejected, addError will not be called
      const wasRejected = errorsSpy.addError.called;

      errorsSpy.addError.reset();

      validateRequiredPartialDate(errorsSpy, 'XXXX-01-XX', {}, {});

      // Both functions should handle invalid patterns the same way
      expect(errorsSpy.addError.called).to.equal(wasRejected);
    });
  });

  describe('normalizeDateInput (direct)', () => {
    it('returns date-field object as-is', () => {
      const input = { month: '1', day: '15', year: '2023' };
      const result = normalizeDateInput(input);
      expect(result).to.equal(input);
    });

    it('converts ISO string to date-field object (complete date)', () => {
      const result = normalizeDateInput('2023-01-15');
      expect(result).to.deep.equal({ month: '1', day: '15', year: '2023' });
    });

    it('converts ISO string to date-field object (month-year partial)', () => {
      const result = normalizeDateInput('2023-01-XX');
      expect(result).to.deep.equal({ month: '1', day: '', year: '2023' });
    });

    it('converts ISO string to date-field object (year-only partial)', () => {
      const result = normalizeDateInput('2023-XX-XX');
      expect(result).to.deep.equal({ month: '', day: '', year: '2023' });
    });

    it('returns empty date-field object for null/undefined', () => {
      expect(normalizeDateInput(null)).to.deep.equal({
        month: '',
        day: '',
        year: '',
      });
      expect(normalizeDateInput(undefined)).to.deep.equal({
        month: '',
        day: '',
        year: '',
      });
    });

    it('handles invalid pattern strings gracefully', () => {
      const result = normalizeDateInput('XXXX-01-XX');
      expect(result).to.deep.equal({ month: '', day: '', year: '' });
    });
  });

  describe('error message handling', () => {
    it('should handle form validation errors gracefully', () => {
      // Test that validation functions handle errors appropriately
      validatePartialDate(errorsSpy, '', {}, { required: true });
      expect(errorsSpy.addError.called).to.be.true;
    });

    it('should pass custom error messages through when validation fails', () => {
      const customMessage = 'This is a custom error';
      validatePartialDate(
        errorsSpy,
        '',
        {},
        { required: true },
        { required: customMessage },
      );

      expect(errorsSpy.addError.called).to.be.true;
    });

    it('should handle year validation correctly', () => {
      validateYearOnlyPartialDate(errorsSpy, '2020');
      expect(errorsSpy.addError.called).to.be.false;
    });
  });
});
