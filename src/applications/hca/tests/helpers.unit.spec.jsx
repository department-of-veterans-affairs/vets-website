import { expect } from 'chai';

import {
  expensesLessThanIncome,
  getCSTOffset,
  getOffsetTime,
  getAdjustedTime,
  isAfterCentralTimeDate,
  isBeforeCentralTimeDate,
} from '../helpers.jsx';

describe('HCA helpers', () => {
  describe('expensesLessThanIncome', () => {
    it('should return true if expenses less than income', () => {
      const formData = {
        veteranNetIncome: 3,
        deductibleMedicalExpenses: 2,
      };

      expect(expensesLessThanIncome('deductibleEducationExpenses')(formData)).to
        .be.true;
    });
    it('should return false if expenses greater than income', () => {
      const formData = {
        veteranNetIncome: 3,
        deductibleMedicalExpenses: 4,
      };

      expect(expensesLessThanIncome('deductibleEducationExpenses')(formData)).to
        .be.true;
    });
    it('should include income from dependents', () => {
      const formData = {
        deductibleMedicalExpenses: 2,
        dependents: [
          {
            grossIncome: 3,
          },
        ],
      };

      expect(expensesLessThanIncome('deductibleEducationExpenses')(formData)).to
        .be.true;
    });
    it('should include spouse income', () => {
      const formData = {
        deductibleMedicalExpenses: 2,
        'view:spouseIncome': {
          spouseGrossIncome: 3,
        },
      };

      expect(expensesLessThanIncome('deductibleEducationExpenses')(formData)).to
        .be.true;
    });
    it('should show only if last non-zero expense amount', () => {
      const formData = {
        dependents: [
          {
            grossIncome: 3,
          },
        ],
        deductibleEducationExpenses: 0,
        deductibleFuneralExpenses: 0,
        deductibleMedicalExpenses: 4,
      };

      expect(expensesLessThanIncome('deductibleMedicalExpenses')(formData)).to
        .be.false;
      expect(expensesLessThanIncome('deductibleEducationExpenses')(formData)).to
        .be.true;
      expect(expensesLessThanIncome('deductibleFuneralExpenses')(formData)).to
        .be.true;
    });
    it('should show warning just under last field if all expenses are filled', () => {
      const formData = {
        dependents: [
          {
            grossIncome: 3,
          },
        ],
        deductibleEducationExpenses: 4,
        deductibleFuneralExpenses: 4,
        deductibleMedicalExpenses: 4,
      };

      expect(expensesLessThanIncome('deductibleMedicalExpenses')(formData)).to
        .be.true;
      expect(expensesLessThanIncome('deductibleEducationExpenses')(formData)).to
        .be.false;
      expect(expensesLessThanIncome('deductibleFuneralExpenses')(formData)).to
        .be.true;
    });
  });
  describe('getCSTOffset', () => {
    it('should return -300 if is daylight savings time', () => {
      expect(getCSTOffset(true)).to.equal(-300);
    });
    it('should return -360 if is not daylight savings time', () => {
      expect(getCSTOffset(false)).to.equal(-360);
    });
  });
  describe('getOffsetTime', () => {
    it('should convert an offset number of minutes into milliseconds', () => {
      expect(getOffsetTime(1)).to.equal(60000);
    });
  });
  describe('getAdjustedTime', () => {
    it('should determine utc time', () => {
      expect(getAdjustedTime(1, 1)).to.equal(2);
    });
  });
  describe('isAfterCentralTimeDate', () => {
    it('should return true if the discharge date is after the Central Time reference date', () => {
      expect(isAfterCentralTimeDate('9999-12-24')).to.be.true;
    });
    it('should return false if the discharge date is not after the Central Time reference date', () => {
      expect(isAfterCentralTimeDate('2000-12-12')).to.be.false;
    });
  });
  describe('isBeforeCentralTimeDate', () => {
    it('should return true if the discharge date is after the Central Time reference date', () => {
      expect(isBeforeCentralTimeDate('9999-12-24')).to.be.false;
    });
    it('should return false if the discharge date is not after the Central Time reference date', () => {
      expect(isBeforeCentralTimeDate('2000-12-12')).to.be.true;
    });
  });
});
