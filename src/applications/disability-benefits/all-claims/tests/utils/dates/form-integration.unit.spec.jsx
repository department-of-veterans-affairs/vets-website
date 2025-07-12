import { expect } from 'chai';
import sinon from 'sinon';

import {
  dateFieldToISO,
  isoToDateField,
  formatReviewDate,
  validateFormDateField,
  createDateRange,
  validateFormDateRange,
  getCurrentFormDate,
  adjustFormDate,
} from '../../../utils/dates/form-integration';

describe('Disability benefits 526EZ -- Form integration date utilities', () => {
  describe('dateFieldToISO', () => {
    it('should convert complete date field to ISO format', () => {
      const dateField = { month: '1', day: '15', year: '2023' };
      expect(dateFieldToISO(dateField)).to.equal('2023-01-15');

      const paddedField = { month: '12', day: '31', year: '2023' };
      expect(dateFieldToISO(paddedField)).to.equal('2023-12-31');
    });

    it('should handle value objects in fields', () => {
      const dateField = {
        month: { value: '6' },
        day: { value: '5' },
        year: { value: '2023' },
      };
      expect(dateFieldToISO(dateField)).to.equal('2023-06-05');
    });

    it('should return partial date format for incomplete dates', () => {
      expect(dateFieldToISO({ month: 'XX', day: '15', year: '2023' })).to.equal(
        '2023-XX-15',
      );
      expect(dateFieldToISO({ month: '1', day: 'XX', year: '2023' })).to.equal(
        '2023-01-XX',
      );
      expect(dateFieldToISO({ month: '1', day: '15', year: 'XXXX' })).to.equal(
        'XXXX-01-15',
      );
    });

    it('should handle missing fields', () => {
      expect(dateFieldToISO({ month: '', day: '15', year: '2023' })).to.equal(
        '2023-XX-15',
      );
      expect(dateFieldToISO({ month: '1', day: '', year: '2023' })).to.equal(
        '2023-01-XX',
      );
      expect(dateFieldToISO({ month: '1', day: '15', year: '' })).to.equal(
        'XXXX-01-15',
      );
    });

    it('should return null for invalid complete dates', () => {
      const invalidDate = { month: '13', day: '32', year: '2023' };
      expect(dateFieldToISO(invalidDate)).to.be.null;
    });

    it('should handle null input', () => {
      expect(dateFieldToISO(null)).to.be.null;
      expect(dateFieldToISO(undefined)).to.be.null;
    });
  });

  describe('isoToDateField', () => {
    it('should convert ISO date to date field object', () => {
      const result = isoToDateField('2023-01-15');
      expect(result).to.deep.equal({
        month: '1',
        day: '15',
        year: '2023',
      });

      const paddedResult = isoToDateField('2023-12-05');
      expect(paddedResult).to.deep.equal({
        month: '12',
        day: '5',
        year: '2023',
      });
    });

    it('should handle partial dates', () => {
      expect(isoToDateField('2023-XX-15')).to.deep.equal({
        month: '',
        day: '15',
        year: '2023',
      });
      expect(isoToDateField('2023-01-XX')).to.deep.equal({
        month: '1',
        day: '',
        year: '2023',
      });
      expect(isoToDateField('XXXX-01-15')).to.deep.equal({
        month: '1',
        day: '15',
        year: '',
      });
    });

    it('should handle invalid input', () => {
      expect(isoToDateField(null)).to.deep.equal({
        month: '',
        day: '',
        year: '',
      });
      expect(isoToDateField('')).to.deep.equal({
        month: '',
        day: '',
        year: '',
      });
      expect(isoToDateField('invalid')).to.deep.equal({
        month: '',
        day: '',
        year: '',
      });
      expect(isoToDateField(123)).to.deep.equal({
        month: '',
        day: '',
        year: '',
      });
    });
  });

  describe('formatReviewDate', () => {
    it('should format complete dates', () => {
      expect(formatReviewDate('2023-01-15')).to.equal('January 15, 2023');
      expect(formatReviewDate('2023-12-31')).to.equal('December 31, 2023');
    });

    it('should format month-year only when requested', () => {
      expect(formatReviewDate('2023-01-15', true)).to.equal('January 2023');
      expect(formatReviewDate('2023-12-31', true)).to.equal('December 2023');
    });

    it('should handle partial dates with year and month', () => {
      expect(formatReviewDate('2023-01-XX')).to.equal('January 2023');
      expect(formatReviewDate('2023-12-XX')).to.equal('December 2023');
    });

    it('should handle year-only partial dates', () => {
      expect(formatReviewDate('2023-XX-XX')).to.equal('2023');
      expect(formatReviewDate('1999-XX-XX')).to.equal('1999');
    });

    it('should return original string for other partial formats', () => {
      expect(formatReviewDate('XXXX-01-XX')).to.equal('XXXX-01-XX');
      expect(formatReviewDate('XXXX-XX-15')).to.equal('XXXX-XX-15');
    });

    it('should handle invalid dates', () => {
      expect(formatReviewDate('')).to.equal('');
      expect(formatReviewDate(null)).to.equal('');
      expect(formatReviewDate('invalid-date')).to.equal('invalid-date');
    });
  });

  describe('validateFormDateField', () => {
    it('should validate required complete dates', () => {
      const dateField = { month: '1', day: '15', year: '2023' };
      const result = validateFormDateField(dateField, { required: true });
      expect(result.isValid).to.be.true;
      expect(result.error).to.be.null;
    });

    it('should error on missing required fields', () => {
      const result = validateFormDateField({}, { required: true });
      expect(result.isValid).to.be.false;
      expect(result.error).to.include('complete date');
    });

    it('should validate month-year only fields', () => {
      const dateField = { month: '1', day: '', year: '2023' };
      const result = validateFormDateField(dateField, {
        required: true,
        monthYearOnly: true,
      });
      expect(result.isValid).to.be.true;
    });

    it('should error on missing month-year fields', () => {
      const dateField = { month: '', day: '', year: '2023' };
      const result = validateFormDateField(dateField, {
        required: true,
        monthYearOnly: true,
      });
      expect(result.isValid).to.be.false;
      expect(result.error).to.include('month and year');
    });

    it('should allow empty fields when not required', () => {
      const result = validateFormDateField({}, { required: false });
      expect(result.isValid).to.be.true;
    });

    it('should validate future dates', () => {
      const clock = sinon.useFakeTimers(new Date('2023-06-15'));

      const futureField = { month: '7', day: '1', year: '2023' };
      const futureResult = validateFormDateField(futureField, {
        futureOnly: true,
      });
      expect(futureResult.isValid).to.be.true;

      const pastField = { month: '5', day: '1', year: '2023' };
      const pastResult = validateFormDateField(pastField, { futureOnly: true });
      expect(pastResult.isValid).to.be.false;
      expect(pastResult.error).to.include('must be in the future');

      clock.restore();
    });

    it('should validate past dates', () => {
      const clock = sinon.useFakeTimers(new Date('2023-06-15'));

      const pastField = { month: '5', day: '1', year: '2023' };
      const pastResult = validateFormDateField(pastField, { pastOnly: true });
      expect(pastResult.isValid).to.be.true;

      const futureField = { month: '7', day: '1', year: '2023' };
      const futureResult = validateFormDateField(futureField, {
        pastOnly: true,
      });
      expect(futureResult.isValid).to.be.false;
      expect(futureResult.error).to.include('must be in the past');

      clock.restore();
    });

    it('should handle invalid date values', () => {
      const invalidField = { month: '13', day: '32', year: '2023' };
      const result = validateFormDateField(invalidField);
      expect(result.isValid).to.be.false;
      expect(result.error).to.include('valid date');
    });
  });

  describe('createDateRange', () => {
    it('should create date range from form fields', () => {
      const fromField = { month: '1', day: '1', year: '2023' };
      const toField = { month: '12', day: '31', year: '2023' };
      const result = createDateRange(fromField, toField);
      expect(result).to.deep.equal({
        from: '2023-01-01',
        to: '2023-12-31',
      });
    });

    it('should handle partial dates', () => {
      const fromField = { month: '1', day: 'XX', year: '2023' };
      const toField = { month: '12', day: 'XX', year: '2023' };
      const result = createDateRange(fromField, toField);
      expect(result).to.deep.equal({
        from: '2023-01-XX',
        to: '2023-12-XX',
      });
    });

    it('should handle null fields', () => {
      const result = createDateRange(null, null);
      expect(result).to.deep.equal({
        from: null,
        to: null,
      });
    });
  });

  describe('validateFormDateRange', () => {
    it('should validate valid date ranges', () => {
      const fromField = { month: '1', day: '1', year: '2023' };
      const toField = { month: '12', day: '31', year: '2023' };
      const result = validateFormDateRange(fromField, toField);
      expect(result.isValid).to.be.true;
    });

    it('should error when end date is before start date', () => {
      const fromField = { month: '12', day: '31', year: '2023' };
      const toField = { month: '1', day: '1', year: '2023' };
      const result = validateFormDateRange(fromField, toField);
      expect(result.isValid).to.be.false;
      expect(result.error).to.include('End date must be after start date');
    });

    it('should propagate individual field errors', () => {
      const fromField = { month: '13', day: '1', year: '2023' };
      const toField = { month: '1', day: '1', year: '2023' };
      const result = validateFormDateRange(fromField, toField);
      expect(result.isValid).to.be.false;
      expect(result.error).to.include('Start date:');
    });

    it('should pass options to field validation', () => {
      const fromField = {};
      const toField = { month: '1', day: '1', year: '2023' };
      const result = validateFormDateRange(fromField, toField, {
        required: true,
      });
      expect(result.isValid).to.be.false;
      expect(result.error).to.include('Start date:');
    });

    it('should allow partial dates without range validation', () => {
      const fromField = { month: '1', day: 'XX', year: '2023' };
      const toField = { month: '12', day: 'XX', year: '2023' };
      const result = validateFormDateRange(fromField, toField);
      expect(result.isValid).to.be.true;
    });
  });

  describe('getCurrentFormDate', () => {
    it('should return current date as form field', () => {
      const clock = sinon.useFakeTimers(new Date('2023-06-15'));
      const result = getCurrentFormDate();
      expect(result).to.deep.equal({
        month: '6',
        day: '15',
        year: '2023',
      });
      clock.restore();
    });

    it('should handle single digit months and days', () => {
      const clock = sinon.useFakeTimers(new Date('2023-01-05'));
      const result = getCurrentFormDate();
      expect(result).to.deep.equal({
        month: '1',
        day: '5',
        year: '2023',
      });
      clock.restore();
    });
  });

  describe('adjustFormDate', () => {
    it('should add time to date field', () => {
      const dateField = { month: '1', day: '15', year: '2023' };
      const result = adjustFormDate(dateField, 10, 'days');
      expect(result).to.deep.equal({
        month: '1',
        day: '25',
        year: '2023',
      });
    });

    it('should subtract time from date field', () => {
      const dateField = { month: '1', day: '15', year: '2023' };
      const result = adjustFormDate(dateField, -10, 'days');
      expect(result).to.deep.equal({
        month: '1',
        day: '5',
        year: '2023',
      });
    });

    it('should handle month transitions', () => {
      const dateField = { month: '1', day: '25', year: '2023' };
      const result = adjustFormDate(dateField, 10, 'days');
      expect(result).to.deep.equal({
        month: '2',
        day: '4',
        year: '2023',
      });
    });

    it('should handle year transitions', () => {
      const dateField = { month: '12', day: '25', year: '2023' };
      const result = adjustFormDate(dateField, 10, 'days');
      expect(result).to.deep.equal({
        month: '1',
        day: '4',
        year: '2024',
      });
    });

    it('should work with different units', () => {
      const dateField = { month: '1', day: '15', year: '2023' };

      const monthResult = adjustFormDate(dateField, 2, 'months');
      expect(monthResult.month).to.equal('3');

      const yearResult = adjustFormDate(dateField, 1, 'years');
      expect(yearResult.year).to.equal('2024');

      const weekResult = adjustFormDate(dateField, 1, 'weeks');
      expect(weekResult.day).to.equal('22');
    });

    it('should validate amount parameter', () => {
      const dateField = { month: '1', day: '15', year: '2023' };

      expect(adjustFormDate(dateField, 'invalid', 'days')).to.deep.equal(
        dateField,
      );
      expect(adjustFormDate(dateField, null, 'days')).to.deep.equal(dateField);
      expect(adjustFormDate(dateField, Infinity, 'days')).to.deep.equal(
        dateField,
      );
      expect(adjustFormDate(dateField, NaN, 'days')).to.deep.equal(dateField);
    });

    it('should validate unit parameter', () => {
      const dateField = { month: '1', day: '15', year: '2023' };

      expect(adjustFormDate(dateField, 10, 'invalid-unit')).to.deep.equal(
        dateField,
      );
      expect(adjustFormDate(dateField, 10, null)).to.deep.equal(dateField);
      expect(adjustFormDate(dateField, 10, 123)).to.deep.equal(dateField);
    });

    it('should handle partial dates', () => {
      const partialField = { month: '1', day: 'XX', year: '2023' };
      const result = adjustFormDate(partialField, 10, 'days');
      expect(result).to.deep.equal(partialField);
    });

    it('should handle invalid date fields', () => {
      const invalidField = { month: '13', day: '32', year: '2023' };
      const result = adjustFormDate(invalidField, 10, 'days');
      expect(result).to.deep.equal(invalidField);
    });

    it('should handle null input', () => {
      const result = adjustFormDate(null, 10, 'days');
      expect(result).to.be.null;
    });
  });
});
