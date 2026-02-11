import { expect } from 'chai';
import {
  transformDebtData,
  getSummaryCardContent,
  getDetailsAlertContent,
} from '../../combined/utils/cardContentHelper';
import { APP_TYPES } from '../../combined/utils/helpers';

describe('cardContentHelper', () => {
  const mockDebt = {
    compositeDebtId: '2111599',
    deductionCode: '21',
    benefitType: 'Loan Guaranty',
    currentAr: '1000.00',
    diaryCode: '109',
    debtHistory: [
      { date: '01/15/2025', letterCode: '109' },
      { date: '01/10/2025', letterCode: '100' },
    ],
  };

  describe('transformDebtData', () => {
    it('transforms debt data correctly', () => {
      const result = transformDebtData(mockDebt);

      expect(result).to.deep.include({
        id: '2111599',
        type: APP_TYPES.DEBT,
        header: 'Loan Guaranty',
        amount: '$1,000.00',
        diaryCode: '109',
      });
      expect(result.dateOfLetter).to.be.a('string');
    });

    it('uses benefitType when deduction code not found', () => {
      const debtWithUnknownCode = {
        ...mockDebt,
        deductionCode: '99',
        benefitType: 'Unknown Benefit',
      };

      const result = transformDebtData(debtWithUnknownCode);
      expect(result.header).to.equal('Unknown Benefit');
    });
  });

  describe('getSummaryCardContent', () => {
    it('returns correct content for diary code 109 (status type 8)', () => {
      const data = transformDebtData(mockDebt);
      const result = getSummaryCardContent(data);

      expect(result.alertStatus).to.equal('warning');
      expect(result.message).to.include('Pay your past due balance');
      expect(result.message).to.include('$1,000.00');
      expect(result.linkIds).to.include.members(['details', 'resolve']);
    });

    it('handles different status types correctly', () => {
      const testCases = [
        { diaryCode: '002', expectedStatus: 'info' },
        { diaryCode: '081', expectedStatus: 'warning' },
        { diaryCode: '450', expectedStatus: 'info' },
        { diaryCode: '080', expectedStatus: 'warning' },
      ];

      testCases.forEach(({ diaryCode, expectedStatus }) => {
        const data = { ...transformDebtData(mockDebt), diaryCode };
        const result = getSummaryCardContent(data);
        expect(result.alertStatus).to.equal(expectedStatus);
      });
    });
  });

  describe('getDetailsAlertContent', () => {
    it('returns correct details content for diary code 109', () => {
      const data = transformDebtData(mockDebt);
      const result = getDetailsAlertContent(data);

      expect(result.alertStatus).to.equal('warning');
      expect(result.headerText).to.include('Pay your past due balance');
      expect(result.bodyText).to.include('$1,000.00');
      expect(result.linkIds).to.include('resolve');
      expect(result.phoneSet).to.be.null;
    });

    it('includes phone set for status type 1', () => {
      const data = { ...transformDebtData(mockDebt), diaryCode: '002' };
      const result = getDetailsAlertContent(data);

      expect(result.phoneSet).to.be.an('object');
      expect(result.phoneSet).to.have.property('tollFree');
      expect(result.phoneSet).to.have.property('international');
    });

    it('includes treasury phone set for status type 9', () => {
      const data = { ...transformDebtData(mockDebt), diaryCode: '080' };
      const result = getDetailsAlertContent(data);

      expect(result.phoneSet).to.be.an('object');
      expect(result.phoneSet).to.have.property('tollFree');
    });
  });
});
