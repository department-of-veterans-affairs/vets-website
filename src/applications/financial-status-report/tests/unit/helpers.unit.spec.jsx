import { expect } from 'chai';
import { isValidStartDate, isValidEndDate } from '../../utils/helpers';

describe('Financial Status Report helpers', () => {
  // EmploymentWorkDates should validate start dates correctly
  describe('EmploymentWorkDates isValidStartDate: ', () => {
    it('should return true with valid start date in YYYY-MM-DD format', () => {
      expect(isValidStartDate('1961-08-01')).to.equal(true);
    });

    it('should return true with valid start date in YYYY-MM format', () => {
      expect(isValidStartDate('1961-08')).to.equal(true);
    });

    it('should return false with empty start date', () => {
      expect(isValidStartDate('')).to.equal(false);
    });

    it('should return false with incomplete start date - missing year', () => {
      expect(isValidStartDate('-03-01')).to.equal(false);
    });

    it('should return false with incomplete start date - missing month', () => {
      expect(isValidStartDate('1980')).to.equal(false);
    });

    it('should return false with start date in the future', () => {
      expect(isValidStartDate('2124-04-01')).to.equal(false);
    });

    it('should return false with invalid start date format', () => {
      expect(isValidStartDate('01-2022')).to.equal(false);
    });
  });

  // EmploymentWorkDates should validate end dates correctly
  describe('EmploymentWorkDates isValidEndDate: ', () => {
    it('should return true with valid end date in YYYY-MM-DD format', () => {
      expect(isValidEndDate('2001-10-01', '2021-08-01')).to.equal(true);
    });

    it('should return true with valid end date in YYYY-MM format', () => {
      expect(isValidEndDate('2001-10', '2021-08')).to.equal(true);
    });

    it('should return false with empty end date', () => {
      expect(isValidEndDate('2001-10-01', '')).to.equal(false);
    });

    it('should return false with incomplete end date - missing year', () => {
      expect(isValidEndDate('2001-10-01', '-03-01')).to.equal(false);
    });

    it('should return false with incomplete end date - missing month', () => {
      expect(isValidEndDate('2001-10-01', '2022')).to.equal(false);
    });

    it('should return false with end date in the future', () => {
      expect(isValidEndDate('2001-10-01', '2124-04-01')).to.equal(false);
    });

    it('should return false if end date is before start date', () => {
      expect(isValidEndDate('2021-08-01', '2001-10-01')).to.equal(false);
    });

    it('should return false with invalid end date format', () => {
      expect(isValidEndDate('2001-10-01', '01-2022')).to.equal(false);
    });
  });
});
