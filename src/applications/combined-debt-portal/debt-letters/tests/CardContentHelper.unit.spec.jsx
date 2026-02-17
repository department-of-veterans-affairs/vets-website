import { expect } from 'chai';
import {
  transformDebtData,
  getSummaryCardContent,
  getDetailsAlertContent,
} from '../../combined/utils/cardContentHelper';
import { APP_TYPES } from '../../combined/utils/helpers';
import { endDate } from '../utils/helpers';

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
      expect(result.messageKey).to.equal(
        'diaryCodes.statusTypes.8.summary.body',
      );
      expect(result.messageValues).to.have.property('amountDue', '$1,000.00');
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
      expect(result.headerKey).to.equal(
        'diaryCodes.statusTypes.8.details.header',
      );
      expect(result.headerValues).to.have.property('endDateText');
      expect(result.bodyKey).to.equal('diaryCodes.statusTypes.8.details.body');
      expect(result.bodyValues).to.have.property('amountDue', '$1,000.00');
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

  describe('endDate function', () => {
    it('calculates 30-day date for diary code 815', () => {
      const result = endDate('01/01/2025', '815');
      expect(result).to.equal('January 31, 2025');
    });

    it('calculates 60-day date for all other diary codes', () => {
      const testCases = [
        { diaryCode: '100', expected: 'March 2, 2025' },
        { diaryCode: '117', expected: 'March 2, 2025' },
        { diaryCode: '123', expected: 'March 2, 2025' },
        { diaryCode: '600', expected: 'March 2, 2025' },
        { diaryCode: '820', expected: 'March 2, 2025' },
      ];

      testCases.forEach(({ diaryCode, expected }) => {
        const result = endDate('01/01/2025', diaryCode);
        expect(result).to.equal(expected);
      });
    });

    it('handles missing date gracefully', () => {
      const result = endDate(null, '100');
      expect(result).to.equal('60 days from when you received this notice');
    });

    it('handles undefined date gracefully', () => {
      const result = endDate(undefined, '815');
      expect(result).to.equal('30 days from when you received this notice');
    });

    it('handles invalid date format gracefully', () => {
      const result = endDate('invalid-date', '100');
      expect(result).to.equal('60 days from when you received this notice');
    });

    it('handles empty string date gracefully', () => {
      const result = endDate('', '815');
      expect(result).to.equal('30 days from when you received this notice');
    });

    it('handles month boundaries correctly', () => {
      const result = endDate('12/15/2024', '815');
      expect(result).to.equal('January 14, 2025');
    });

    it('handles leap year correctly', () => {
      const result = endDate('02/15/2024', '100');
      expect(result).to.equal('April 15, 2024');
    });
  });
});
