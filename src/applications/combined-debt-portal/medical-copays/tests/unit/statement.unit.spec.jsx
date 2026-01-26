import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import AccountSummary from '../../components/AccountSummary';
import StatementAddresses from '../../components/StatementAddresses';
import StatementCharges from '../../components/StatementCharges';
import StatementTable from '../../components/StatementTable';
import DownloadStatement from '../../components/DownloadStatement';

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
          paymentsReceived={selectedCopay.pHTotCredits}
          previousBalance={selectedCopay.pHPrevBal}
        />,
      );
      expect(summary.getByTestId('account-summary-head')).to.exist;
      expect(summary.getByTestId('account-summary-previous')).to.exist;
      expect(summary.getByTestId('account-summary-previous')).to.have.text(
        'Previous balance: $30.00',
      );
      expect(summary.getByTestId('account-summary-credits')).to.exist;
      expect(summary.getByTestId('account-summary-credits')).to.have.text(
        'Payments received: $15.00',
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

  describe('StatementTable component', () => {
    const mockSelectedCopay = {
      pHNewBalance: 25,
      pHTotCredits: 15,
      pHPrevBal: 30,
      statementStartDate: '2024-05-03',
      statementEndDate: '2024-06-03',
      details: [
        {
          pDTransDescOutput: 'Test Charge',
          pDRefNo: '123-BILLREF',
          pDTransAmt: 100,
          pDDatePostedOutput: '05/15/2024',
        },
      ],
    };

    const mockFormatCurrency = amount => {
      if (!amount) return '$0.00';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    };

    it('should render statement table with date range when dates are provided', () => {
      const { container } = render(
        <StatementTable
          charges={mockSelectedCopay.details}
          formatCurrency={mockFormatCurrency}
          selectedCopay={mockSelectedCopay}
        />,
      );

      const table = container.querySelector('va-table');
      expect(table).to.exist;
      expect(table.getAttribute('table-title')).to.include(
        'This statement shows charges you received between May 3, 2024 and June 3, 2024',
      );
    });

    it('should render fallback text when statement dates are missing', () => {
      const copayWithoutDates = {
        ...mockSelectedCopay,
        statementStartDate: null,
        statementEndDate: null,
      };

      const { container } = render(
        <StatementTable
          charges={mockSelectedCopay.details}
          formatCurrency={mockFormatCurrency}
          selectedCopay={copayWithoutDates}
        />,
      );

      const table = container.querySelector('va-table');
      expect(table).to.exist;
      expect(table.getAttribute('table-title')).to.equal(
        'This statement shows your current charges.',
      );
    });

    it('should NOT render Total Credits row', () => {
      const { container } = render(
        <StatementTable
          charges={mockSelectedCopay.details}
          formatCurrency={mockFormatCurrency}
          selectedCopay={mockSelectedCopay}
        />,
      );

      const tableRows = container.querySelectorAll('va-table-row');
      const totalCreditsRow = Array.from(tableRows).find(row =>
        row.textContent.includes('Total Credits'),
      );
      expect(totalCreditsRow).to.not.exist;
    });
  });

  describe('DownloadStatement component', () => {
    const mockProps = {
      statementId: '123',
      statementDate: '05032024',
      fullName: 'John Doe',
    };

    it('should render PDF link with proper spacing', () => {
      const { container } = render(<DownloadStatement {...mockProps} />);

      // Check that va-link has the correct filetype attribute
      const vaLink = container.querySelector('va-link');
      expect(vaLink).to.exist;
      expect(vaLink.getAttribute('filetype')).to.equal('PDF');
    });

    it('should render download link with correct attributes', () => {
      const { container } = render(<DownloadStatement {...mockProps} />);

      const vaLink = container.querySelector('va-link');
      expect(vaLink).to.exist;
      expect(vaLink.hasAttribute('download')).to.be.true;
      expect(vaLink.getAttribute('filetype')).to.equal('PDF');
    });
  });
});
