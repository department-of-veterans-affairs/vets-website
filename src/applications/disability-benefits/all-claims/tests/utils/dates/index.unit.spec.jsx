import { expect } from 'chai';

import * as dateUtils from '../../../utils/dates';

describe('Disability benefits 526EZ -- Date utilities index module', () => {
  it('should export all formatting functions', () => {
    expect(dateUtils.formatDate).to.be.a('function');
    expect(dateUtils.formatDateRange).to.be.a('function');
    expect(dateUtils.formatMonthYearDate).to.be.a('function');
    expect(dateUtils.formatDateShort).to.be.a('function');
    expect(dateUtils.formatDateLong).to.be.a('function');
    expect(dateUtils.isValidFullDate).to.be.a('function');
    expect(dateUtils.isValidYear).to.be.a('function');
    // isValidPartialDate has been removed - partial date validation is now handled by validateApproximateDate
    expect(dateUtils.validateAge).to.be.a('function');
    expect(dateUtils.validateSeparationDate).to.be.a('function');
    expect(dateUtils.validateServicePeriod).to.be.a('function');
    expect(dateUtils.isLessThan180DaysInFuture).to.be.a('function');
    expect(dateUtils.isWithinRange).to.be.a('function');
    expect(dateUtils.isWithinServicePeriod).to.be.a('function');
    expect(dateUtils.parseDate).to.be.a('function');
    expect(dateUtils.parseDateWithTemplate).to.be.a('function');
    expect(dateUtils.isBddClaimValid).to.be.a('function');
    expect(dateUtils.getBddSeparationDateError).to.be.a('function');
    expect(dateUtils.isMonthOnly).to.be.a('function');
    expect(dateUtils.isYearOnly).to.be.a('function');
    expect(dateUtils.isYearMonth).to.be.a('function');
    expect(dateUtils.findEarliestServiceDate).to.be.a('function');
    expect(dateUtils.isTreatmentBeforeService).to.be.a('function');
  });

  it('should export all comparison functions', () => {
    expect(dateUtils.isDateBefore).to.be.a('function');
    expect(dateUtils.isDateAfter).to.be.a('function');
    expect(dateUtils.isDateSame).to.be.a('function');
    expect(dateUtils.isDateBetween).to.be.a('function');
    expect(dateUtils.compareDates).to.be.a('function');
  });

  it('should export all validation functions', () => {
    expect(dateUtils.validateDateNotBeforeReference).to.be.a('function');
    expect(dateUtils.validateSeparationDateWithRules).to.be.a('function');
    expect(dateUtils.validateTitle10ActivationDate).to.be.a('function');
  });

  it('should export form integration functions', () => {
    expect(dateUtils.dateFieldToISO).to.be.a('function');
    expect(dateUtils.isoToDateField).to.be.a('function');
    expect(dateUtils.formatReviewDate).to.be.a('function');
    expect(dateUtils.validateFormDateField).to.be.a('function');
    expect(dateUtils.createDateRange).to.be.a('function');
    expect(dateUtils.validateFormDateRange).to.be.a('function');
    expect(dateUtils.getCurrentFormDate).to.be.a('function');
    expect(dateUtils.adjustFormDate).to.be.a('function');
  });

  it('should export product-specific dates object', () => {
    expect(dateUtils.productSpecificDates).to.be.an('object');
    expect(dateUtils.productSpecificDates.ptsd).to.be.an('object');
    expect(dateUtils.productSpecificDates.toxicExposure).to.be.an('object');
    expect(dateUtils.productSpecificDates.unemployability).to.be.an('object');
    expect(dateUtils.productSpecificDates.hospitalization).to.be.an('object');
    expect(dateUtils.productSpecificDates.evidence).to.be.an('object');
  });

  it('should export date format constants', () => {
    expect(dateUtils.DATE_FORMAT).to.be.a('string');
    expect(dateUtils.DATE_FORMAT_SHORT).to.be.a('string');
    expect(dateUtils.DATE_FORMAT_LONG).to.be.a('string');
    expect(dateUtils.PARTIAL_DATE_FORMAT).to.be.a('string');
  });

  describe('basic functionality smoke tests', () => {
    it('should format dates correctly', () => {
      expect(dateUtils.formatDate('2023-01-15')).to.equal('January 15, 2023');
      expect(dateUtils.formatDateShort('2023-01-15')).to.equal('01/15/2023');
    });

    it('should validate dates correctly', () => {
      expect(dateUtils.isValidFullDate('2023-01-15')).to.be.true;
      expect(dateUtils.isValidFullDate('invalid')).to.be.false;
    });

    it('should compare dates correctly', () => {
      expect(dateUtils.isDateBefore('2023-01-01', '2023-06-01')).to.be.true;
      expect(dateUtils.isDateAfter('2023-06-01', '2023-01-01')).to.be.true;
    });

    it('should handle form date fields correctly', () => {
      const dateField = { month: '1', day: '15', year: '2023' };
      expect(dateUtils.dateFieldToISO(dateField)).to.equal('2023-01-15');

      const isoResult = dateUtils.isoToDateField('2023-01-15');
      expect(isoResult).to.deep.equal({
        month: '1',
        day: '15',
        year: '2023',
      });
    });
  });
});
