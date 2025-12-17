import React from 'react';
import { render, fireEvent, waitFor, within } from '@testing-library/react';
import { expect } from 'chai';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import StatementTable from '../../components/StatementTable';
import { showVHAPaymentHistory } from '../../../combined/utils/helpers';
import StatementCharges from '../../components/StatementCharges';
import mockstatements from '../../../combined/utils/mocks/mockStatements.json';

const createCharges = count => {
  return Array.from({ length: count }, (_, i) => ({
    pDTransDescOutput: `Charge ${i + 1}`,
    pDDatePostedOutput: '2023-10-01',
    pDRefNo: `REF${i + 1}`,
    pDTransAmt: 10.0,
  }));
};

const mockFormatCurrency = val => `$${val.toFixed(2)}`;

describe('Feature Toggle Data Confirmation', () => {
  it('showVHAPaymentHistory is true', () => {
    const mockState = {
      featureToggles: {
        [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: true,
      },
    };

    const charges = createCharges(15);
    const { container } = render(
      <StatementTable charges={charges} formatCurrency={mockFormatCurrency} />,
    );

    // Query the custom elements directly
    const rows = container.querySelectorAll('va-table-row');

    const firstRow = rows[1];

    const result = showVHAPaymentHistory(mockState);
    expect(result).to.be.true;

    expect(firstRow).to.exist;
    expect(within(firstRow).getByTestId('statement-description')).to.have.text(
      'Charge 1',
    );
    expect(within(firstRow).getByTestId('statement-reference')).to.have.text(
      'REF1',
    );
    expect(
      within(firstRow).getByTestId('statement-transaction-amount'),
    ).to.have.text('$10.00');
    expect(within(firstRow).getByTestId('statement-date')).to.have.text(
      '2023-10-01',
    );

    expect(rows.length).to.equal(11);
  });

  it('navigates to page 2 and displays page 2 data', async () => {
    const charges = createCharges(15);
    const { container } = render(
      <StatementTable charges={charges} formatCurrency={mockFormatCurrency} />,
    );

    const pagination = container.querySelector('va-pagination');

    fireEvent.click(pagination, { detail: { page: 2 } });

    waitFor(() => {
      const rows = container.querySelectorAll('va-table-row');

      expect(rows.length).to.equal(6); // 1 header row + 5 data rows
    });
  });

  // TODO: to be removed once toggle is fully enabled
  it('showVHAPaymentHistory is false', () => {
    const mockState = {
      featureToggles: {
        [FEATURE_FLAG_NAMES.showVHAPaymentHistory]: false,
      },
    };

    const { container } = render(
      <StatementCharges copay={mockstatements[2]} />,
    );

    // Query the custom elements directly
    const firstRow = container.querySelectorAll('va-table-row')[1];

    const result = showVHAPaymentHistory(mockState);
    expect(result).to.be.false;

    expect(firstRow).to.exist;
    expect(
      within(firstRow).getByTestId('statement-charges-description'),
    ).to.have.text('PAYMENT POSTED ON 04/29/2020');
    expect(
      within(firstRow).getByTestId('statement-charges-reference'),
    ).to.have.text('618-K00K9ZK');
    expect(
      within(firstRow).getByTestId('statement-charges-transaction-amount'),
    ).to.have.text('$24.00');
  });
});
