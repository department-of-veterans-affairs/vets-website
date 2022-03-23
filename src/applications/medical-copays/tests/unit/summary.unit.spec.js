import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import AccountSummary from '../../components/AccountSummary';

describe('mcp statement view', () => {
  describe('statement account summary component', () => {
    it('should render account values', () => {
      const selectedCopay = {
        pHNewBalance: 25,
        pHTotCharges: 10,
        pHTotCredits: 15,
        pHPrevBal: 30,
        statementDate: 'November 5',
      };

      const summary = render(
        <AccountSummary
          currentBalance={selectedCopay.pHNewBalance}
          newCharges={selectedCopay.pHTotCharges}
          paymentsReceived={selectedCopay.pHTotCredits}
          previousBalance={selectedCopay.pHPrevBal}
          statementDate={selectedCopay.statementDate}
        />,
      );
      expect(summary.getByTestId('account-summary-head')).to.exist;
      expect(summary.getByTestId('account-summary-date')).to.exist;
      expect(summary.getByTestId('account-summary-date')).to.have.text(
        'Current balance as of November 5',
      );
      expect(summary.getByTestId('account-summary-current')).to.exist;
      expect(summary.getByTestId('account-summary-current')).to.have.text(
        '$25.00',
      );
      expect(summary.getByTestId('account-summary-previous')).to.exist;
      expect(summary.getByTestId('account-summary-previous')).to.have.text(
        'Previous balance: $30.00',
      );
      expect(summary.getByTestId('account-summary-credits')).to.exist;
      expect(summary.getByTestId('account-summary-credits')).to.have.text(
        'Payments received: $15.00',
      );
      expect(summary.getByTestId('account-summary-new-charges')).to.exist;
      expect(summary.getByTestId('account-summary-new-charges')).to.have.text(
        'New charges: $10.00',
      );
    });
  });
});
