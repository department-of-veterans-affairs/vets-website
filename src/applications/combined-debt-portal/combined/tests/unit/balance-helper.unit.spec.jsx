import { expect } from 'chai';
import {
  calculateTotalDebts,
  getLatestDebt,
  calculateTotalBills,
  getLatestBill,
} from '../../utils/balance-helpers';
// TODO: Update referece after refactoring
import mockDebt from '../../utils/mocks/mockDebts.json';
import mockBill from '../../utils/mocks/mockStatements.json';

describe('combined debt portal helpers', () => {
  describe('calculateTotalDebts helper: ', () => {
    it('should calculate total debt', () => {
      expect(calculateTotalDebts(mockDebt.debts)).to.equal(3305.4);
    });

    it('should return 0 if no valid data', () => {
      expect(calculateTotalDebts(null)).to.equal(0);
    });
  });

  describe('getLatestDebt helper: ', () => {
    it('should return latest debt', () => {
      expect(getLatestDebt(mockDebt.debts)).to.equal('12/19/2018');
    });

    it('should return null if no valid data', () => {
      expect(getLatestDebt(null)).to.equal(null);
    });
  });

  describe('calculateTotalBills helper: ', () => {
    it('should calculate total bills', () => {
      expect(calculateTotalBills(mockBill)).to.equal(87);
    });

    it('should return 0 if no valid data', () => {
      expect(calculateTotalBills(null)).to.equal(0);
    });
  });

  describe('getLatestBill helper: ', () => {
    it('should return latest bills', () => {
      expect(getLatestBill(mockBill)).to.equal('12/05/2021');
    });

    it('should return latest bills', () => {
      expect(getLatestBill(null)).to.equal(null);
    });
  });
});
