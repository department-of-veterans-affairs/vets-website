import { renderHook } from '@testing-library/react-hooks';
import { expect } from 'chai';
import { useStatusContent } from '../../combined/hooks/useStatusContent';
import { APP_TYPES } from '../../combined/utils/helpers';

describe('useStatusContent hook', () => {
  const mockDebt = {
    compositeDebtId: '2111599',
    deductionCode: '21',
    benefitType: 'Loan Guaranty',
    currentAr: '1000.00',
    diaryCode: '109',
    debtHistory: [{ date: '01/15/2025', letterCode: '109' }],
  };

  describe('with debt data', () => {
    it('returns correct summary content', () => {
      const { result } = renderHook(() =>
        useStatusContent('debt', mockDebt, 'summary'),
      );

      const { transformedData, message, alertStatus, linkIds } = result.current;

      expect(transformedData).to.deep.include({
        id: '2111599',
        type: APP_TYPES.DEBT,
        header: 'Loan Guaranty',
        amount: '$1,000.00',
      });

      expect(alertStatus).to.equal('warning');
      expect(message).to.include('Pay your past due balance');
      expect(linkIds).to.include.members(['details', 'resolve']);
    });

    it('returns correct details content', () => {
      const { result } = renderHook(() =>
        useStatusContent('debt', mockDebt, 'details'),
      );

      const {
        headerText,
        bodyText,
        alertStatus,
        linkIds,
        phoneSet,
      } = result.current;

      expect(headerText).to.include('Pay your past due balance');
      expect(bodyText).to.include('$1,000.00');
      expect(alertStatus).to.equal('warning');
      expect(linkIds).to.include('resolve');
      expect(phoneSet).to.be.null;
    });

    it('handles different diary codes correctly', () => {
      const testCases = [
        { diaryCode: '002', expectedAlert: 'info' },
        { diaryCode: '081', expectedAlert: 'warning' },
        { diaryCode: '109', expectedAlert: 'warning' },
      ];

      testCases.forEach(({ diaryCode, expectedAlert }) => {
        const { result } = renderHook(() =>
          useStatusContent('debt', { ...mockDebt, diaryCode }, 'summary'),
        );

        expect(result.current.alertStatus).to.equal(expectedAlert);
      });
    });
  });

  describe('error handling', () => {
    it('handles missing data gracefully', () => {
      const { result } = renderHook(() =>
        useStatusContent('debt', {}, 'summary'),
      );

      expect(result.current.transformedData).to.be.an('object');
      expect(result.current.alertStatus).to.equal('info');
    });

    it('handles invalid type', () => {
      const { result } = renderHook(() =>
        useStatusContent('invalid', mockDebt, 'summary'),
      );

      expect(result.current.alertStatus).to.equal('info');
    });
  });
});
