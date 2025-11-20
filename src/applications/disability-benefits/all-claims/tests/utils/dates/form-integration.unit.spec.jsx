/**
 * TODO: tech-debt(you-dont-need-momentjs): Waiting for Node upgrade to support Temporal API
 * @see https://github.com/department-of-veterans-affairs/va.gov-team/issues/110024
 */
/* eslint-disable you-dont-need-momentjs/no-import-moment */
/* eslint-disable you-dont-need-momentjs/no-moment-constructor */
/* eslint-disable you-dont-need-momentjs/add */
/* eslint-disable you-dont-need-momentjs/subtract */
/* eslint-disable you-dont-need-momentjs/format */

import { expect } from 'chai';
import moment from 'moment';

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

    it('should return partial date format for valid incomplete dates', () => {
      // Month + Year (no day) - valid
      expect(
        dateFieldToISO(
          { month: '1', day: '', year: '2023' },
          { allowPartialDates: true },
        ),
      ).to.equal('2023-01-XX');
      // Year only (no month or day) - valid
      expect(
        dateFieldToISO(
          { month: '', day: '', year: '2023' },
          { allowPartialDates: true },
        ),
      ).to.equal('2023-XX-XX');
    });

    it('should reject invalid partial date patterns', () => {
      // Day without month - invalid
      expect(
        dateFieldToISO(
          { month: '', day: '15', year: '2023' },
          { allowPartialDates: true },
        ),
      ).to.be.null;
      // Month without year - invalid
      expect(
        dateFieldToISO(
          { month: '1', day: '15', year: '' },
          { allowPartialDates: true },
        ),
      ).to.be.null;
    });

    it('should handle valid missing field patterns', () => {
      // Month + Year only (no day) - valid
      expect(
        dateFieldToISO(
          { month: '1', day: '', year: '2023' },
          { allowPartialDates: true },
        ),
      ).to.equal('2023-01-XX');
      // Year only - valid
      expect(
        dateFieldToISO(
          { month: '', day: '', year: '2023' },
          { allowPartialDates: true },
        ),
      ).to.equal('2023-XX-XX');
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

    it('should handle valid partial date patterns', () => {
      // Month + Year only
      expect(
        isoToDateField('2023-01-XX', { allowPartialDates: true }),
      ).to.deep.equal({
        month: '1',
        day: '',
        year: '2023',
      });
      // Year only
      expect(
        isoToDateField('2023-XX-XX', { allowPartialDates: true }),
      ).to.deep.equal({
        month: '',
        day: '',
        year: '2023',
      });
    });

    it('should reject invalid partial date patterns', () => {
      // Day without month - should return empty
      expect(
        isoToDateField('2023-XX-15', { allowPartialDates: true }),
      ).to.deep.equal({
        month: '',
        day: '',
        year: '',
      });
      // Month without year - should return empty
      expect(
        isoToDateField('XXXX-01-15', { allowPartialDates: true }),
      ).to.deep.equal({
        month: '',
        day: '',
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
      expect(
        formatReviewDate('2023-01-XX', false, { allowPartialDates: true }),
      ).to.equal('January 2023');
      expect(
        formatReviewDate('2023-12-XX', false, { allowPartialDates: true }),
      ).to.equal('December 2023');
    });

    it('should handle year-only partial dates', () => {
      expect(
        formatReviewDate('2023-XX-XX', false, { allowPartialDates: true }),
      ).to.equal('2023');
      expect(
        formatReviewDate('1999-XX-XX', false, { allowPartialDates: true }),
      ).to.equal('1999');
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
        allowPartialDates: true,
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
      const tomorrow = moment().add(1, 'day');
      const futureField = {
        month: tomorrow.format('M'),
        day: tomorrow.format('D'),
        year: tomorrow.format('YYYY'),
      };
      const futureResult = validateFormDateField(futureField, {
        futureOnly: true,
      });
      expect(futureResult.isValid).to.be.true;

      const yesterday = moment().subtract(1, 'day');
      const pastField = {
        month: yesterday.format('M'),
        day: yesterday.format('D'),
        year: yesterday.format('YYYY'),
      };
      const pastResult = validateFormDateField(pastField, { futureOnly: true });
      expect(pastResult.isValid).to.be.false;
      expect(pastResult.error).to.include('must be in the future');
    });

    it('should validate past dates', () => {
      const yesterday = moment().subtract(1, 'day');
      const pastField = {
        month: yesterday.format('M'),
        day: yesterday.format('D'),
        year: yesterday.format('YYYY'),
      };
      const pastResult = validateFormDateField(pastField, { pastOnly: true });
      expect(pastResult.isValid).to.be.true;

      const tomorrow = moment().add(1, 'day');
      const futureField = {
        month: tomorrow.format('M'),
        day: tomorrow.format('D'),
        year: tomorrow.format('YYYY'),
      };
      const futureResult = validateFormDateField(futureField, {
        pastOnly: true,
      });
      expect(futureResult.isValid).to.be.false;
      expect(futureResult.error).to.include('must be in the past');
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

    it('should handle valid partial date patterns', () => {
      const fromField = { month: '1', day: '', year: '2023' };
      const toField = { month: '12', day: '', year: '2023' };
      const result = createDateRange(fromField, toField, {
        allowPartialDates: true,
      });
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

    it('should allow valid partial dates without range validation', () => {
      const fromField = { month: '1', day: '', year: '2023' };
      const toField = { month: '12', day: '', year: '2023' };
      const result = validateFormDateRange(fromField, toField, {
        allowPartialDates: true,
      });
      expect(result.isValid).to.be.true;
    });
  });

  describe('getCurrentFormDate', () => {
    it('should return current date as form field', () => {
      const now = moment();
      const result = getCurrentFormDate();
      expect(result).to.deep.equal({
        month: now.format('M'),
        day: now.format('D'),
        year: now.format('YYYY'),
      });
    });

    it('should handle date values correctly', () => {
      const result = getCurrentFormDate();
      expect(result.month).to.be.a('string');
      expect(result.day).to.be.a('string');
      expect(result.year).to.be.a('string');
      expect(parseInt(result.month, 10)).to.be.at.least(1);
      expect(parseInt(result.month, 10)).to.be.at.most(12);
      expect(parseInt(result.day, 10)).to.be.at.least(1);
      expect(parseInt(result.day, 10)).to.be.at.most(31);
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
