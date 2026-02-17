import { expect } from 'chai';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import {
  calculateTotalDebts,
  getLatestDebt,
  calculateTotalBills,
  getLatestBill,
} from '../../utils/balance-helpers';
import { showVHAPaymentHistory } from '../../utils/helpers';
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

  describe('showVHAPaymentHistory helper: ', () => {
    it('should return true when feature flag is enabled', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: true,
        },
      };
      expect(showVHAPaymentHistory(mockState)).to.be.true;
    });

    it('should return false when feature flag is disabled', () => {
      const mockState = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: false,
        },
      };
      expect(showVHAPaymentHistory(mockState)).to.be.false;
    });

    it('should return false when feature flag is not present', () => {
      const mockState = {
        featureToggles: {},
      };
      expect(showVHAPaymentHistory(mockState)).to.not.be.true;
    });
  });

  describe('totalBills calculation: ', () => {
    it('should use meta.total when showVHAPaymentHistory is true', () => {
      const shouldShowVHAPaymentHistory = true;
      const mcp = {
        statements: {
          meta: {
            total: 150,
          },
          data: [
            { id: '1', attributes: { currentBalance: 50 } },
            { id: '2', attributes: { currentBalance: 100 } },
          ],
        },
      };

      const totalBills = shouldShowVHAPaymentHistory
        ? mcp.statements.meta.total
        : calculateTotalBills(mcp.statements);

      expect(totalBills).to.equal(150);
    });

    it('should use calculateTotalBills when showVHAPaymentHistory is false', () => {
      const shouldShowVHAPaymentHistory = false;
      const mcp = {
        statements: [
          { id: '1', pHAmtDue: 50 },
          { id: '2', pHAmtDue: 100 },
        ],
      };

      const totalBills = shouldShowVHAPaymentHistory
        ? mcp.statements.meta.total
        : calculateTotalBills(mcp.statements);

      expect(totalBills).to.equal(150);
    });
  });

  describe('bothZero logic: ', () => {
    it('should return true when both totals are zero and no errors', () => {
      const totalDebts = 0;
      const totalBills = 0;
      const billError = null;
      const debtError = false;

      const bothZero =
        totalDebts === 0 && totalBills === 0 && !billError && !debtError;

      expect(bothZero).to.be.true;
    });

    it('should return false when totalDebts is not zero', () => {
      const totalDebts = 100;
      const totalBills = 0;
      const billError = null;
      const debtError = false;

      const bothZero =
        totalDebts === 0 && totalBills === 0 && !billError && !debtError;

      expect(bothZero).to.be.false;
    });

    it('should return false when totalBills is not zero', () => {
      const totalDebts = 0;
      const totalBills = 50;
      const billError = null;
      const debtError = false;

      const bothZero =
        totalDebts === 0 && totalBills === 0 && !billError && !debtError;

      expect(bothZero).to.be.false;
    });

    it('should return false when billError exists', () => {
      const totalDebts = 0;
      const totalBills = 0;
      const billError = { code: '500' };
      const debtError = false;

      const bothZero =
        totalDebts === 0 && totalBills === 0 && !billError && !debtError;

      expect(bothZero).to.be.false;
    });

    it('should return false when debtError is true', () => {
      const totalDebts = 0;
      const totalBills = 0;
      const billError = null;
      const debtError = true;

      const bothZero =
        totalDebts === 0 && totalBills === 0 && !billError && !debtError;

      expect(bothZero).to.be.false;
    });

    it('should return false when both totals are zero but errors exist', () => {
      const totalDebts = 0;
      const totalBills = 0;
      const billError = { code: '403' };
      const debtError = true;

      const bothZero =
        totalDebts === 0 && totalBills === 0 && !billError && !debtError;

      expect(bothZero).to.be.false;
    });
  });
});
