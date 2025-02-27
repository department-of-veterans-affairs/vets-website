import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import AccountSummary from '../../components/AccountSummary';
import StatementAddresses from '../../components/StatementAddresses';
import StatementCharges from '../../components/StatementCharges';

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

  describe('statement addresses component', () => {
    it('should render statement addresses', () => {
      const selectedCopay = {
        station: {
          facilityName: 'Test Facility',
          staTAddress1: '123 Main St',
          staTAddress2: 'Apt 1',
          staTAddress3: 'Address 3',
          city: 'New York',
          state: 'NY',
          ziPCde: '10001',
        },
        pHAddress1: '456 Alternate St',
        pHAddress2: 'Apt 2',
        pHAddress3: 'Test Patient Address 3',
        pHCity: 'Tampa',
        pHState: 'FL',
        pHZipCde: '33333',
      };

      const addresses = render(<StatementAddresses copay={selectedCopay} />);
      expect(addresses.getByTestId('statement-address-head')).to.exist;
      expect(addresses.getByTestId('sender-address-head')).to.exist;

      expect(addresses.getByTestId('sender-facility-name')).to.exist;
      expect(addresses.getByTestId('sender-facility-name')).to.have.text(
        'Test Facility',
      );

      expect(addresses.getByTestId('sender-address-one')).to.exist;
      expect(addresses.getByTestId('sender-address-one')).to.have.text(
        '123 Main St',
      );

      expect(addresses.getByTestId('sender-address-two')).to.exist;
      expect(addresses.getByTestId('sender-address-two')).to.have.text('Apt 1');

      expect(addresses.getByTestId('sender-address-three')).to.exist;
      expect(addresses.getByTestId('sender-address-three')).to.have.text(
        'Address 3',
      );

      expect(addresses.getByTestId('sender-city-state-zip')).to.exist;
      expect(addresses.getByTestId('sender-city-state-zip')).to.have.text(
        'New York, NY 10001',
      );

      expect(addresses.getByTestId('recipient-address-head')).to.exist;
      expect(addresses.getByTestId('recipient-address-one')).to.exist;
      expect(addresses.getByTestId('recipient-address-one')).to.have.text(
        '456 Alternate St',
      );

      expect(addresses.getByTestId('recipient-address-two')).to.exist;
      expect(addresses.getByTestId('recipient-address-two')).to.have.text(
        'Apt 2',
      );

      expect(addresses.getByTestId('recipient-address-three')).to.exist;
      expect(addresses.getByTestId('recipient-address-three')).to.have.text(
        'Test Patient Address 3',
      );

      expect(addresses.getByTestId('recipient-city-state-zip')).to.exist;
      expect(addresses.getByTestId('recipient-city-state-zip')).to.have.text(
        'Tampa, FL 33333',
      );
    });
  });

  describe('statement charges component', () => {
    it('should render statement charges', () => {
      const selectedCopay = {
        details: [
          {
            pDTransDescOutput: 'Test Output',
            pDRefNo: '123-BILLREF',
            pDTransAmtOutput: '350.00',
          },
        ],
      };

      const charges = render(<StatementCharges copay={selectedCopay} />);
      expect(charges.getByTestId('statement-charges-head')).to.exist;
      expect(charges.getByTestId('statement-charges-table')).to.exist;
    });
  });
});
