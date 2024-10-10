import { expect } from 'chai';

import { isValidStartDate, isValidEndDate } from '../../utils/helpers';

describe('Financial Status Report helpers', () => {
  // EmploymentWorkDates and use YYYY-MM-XX format. Day is not critical, so it is replaced with XX
  describe('EmploymentWorkDates isValidStartDate: ', () => {
    it('should return true with valid start date', () => {
      expect(isValidStartDate('1961-08-XX')).to.equal(true);
    });

    it('should return false with incomplete start date - empty date', () => {
      expect(isValidStartDate('')).to.equal(false);
    });

    it('should return false with incomplete start date - missing year', () => {
      expect(isValidStartDate('-03-XX')).to.equal(false);
    });

    it('should return false with incomplete start date - missing month', () => {
      expect(isValidStartDate('1980-XX')).to.equal(false);
    });

    it('should return false with start date in the future', () => {
      expect(isValidStartDate('2124-04-XX')).to.equal(false);
    });
  });

  // EmploymentWorkDates and use YYYY-MM-XX format. Day is not critical, so it is replaced with XX
  // Assumes that the start date is valid - isValidStartDate has it's own checks
  describe('EmploymentWorkDates isValidEndDate: ', () => {
    it('should return true with valid end date', () => {
      expect(isValidEndDate('2001-10-XX', '2021-08-XX')).to.equal(true);
    });

    it('should return false with incomplete end date - empty date', () => {
      expect(isValidEndDate('2001-10-XX', '')).to.equal(false);
    });

    it('should return false with incomplete end date - missing year', () => {
      expect(isValidEndDate('2001-10-XX', '-03-XX')).to.equal(false);
    });

    it('should return false with incomplete end date - missing month', () => {
      expect(isValidEndDate('2001-10-XX', '2022-XX')).to.equal(false);
    });

    it('should return false with end date in teh future', () => {
      expect(isValidEndDate('2001-10-XX', '2124-04-XX')).to.equal(false);
    });
  });
});
