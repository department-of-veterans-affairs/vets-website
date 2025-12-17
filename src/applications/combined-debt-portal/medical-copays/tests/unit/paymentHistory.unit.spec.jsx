import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import StatementTable from '../../components/StatementTable';

const createCharges = count => {
  return Array.from({ length: count }, (_, i) => ({
    pDTransDescOutput: `Charge ${i + 1}`,
    pDDatePostedOutput: '2023-10-01',
    pDRefNo: `REF${i + 1}`,
    pDTransAmt: 10.0,
  }));
};

const mockFormatCurrency = val => `$${val.toFixed(2)}`;

describe('<StatementTable /> Pagination', () => {
  it('renders the data for first page', () => {
    const charges = createCharges(15);
    // Removed getAllByRole from here to fix the error
    const { container } = render(
      <StatementTable charges={charges} formatCurrency={mockFormatCurrency} />,
    );

    // Query the custom elements directly
    const rows = container.querySelectorAll('va-table-row');

    // 1 header row + 10 data rows = 11
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
});
