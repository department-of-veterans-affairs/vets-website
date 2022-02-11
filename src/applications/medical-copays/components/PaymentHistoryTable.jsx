import React, { useState, useCallback } from 'react';
import Pagination from '@department-of-veterans-affairs/component-library/Pagination';
import Table from '@department-of-veterans-affairs/component-library/Table';
import { formatTableData } from '../utils/helpers';

const MAX_ROWS_PER_PAGE = 3;

const mockData = [
  {
    date: `June 3, 2021`,
    desc: `Prescription copay (service connected)`,
    amount: 10,
  },
  {
    date: `June 3, 2021`,
    desc: `Inpatient Community Care Network copay`,
    amount: 290,
  },
  {
    date: `May 3, 2021`,
    desc: `Payments made from April 3, 2021 to May 3, 2021`,
    amount: -102,
  },
  {
    date: `April 3, 2021`,
    desc: `Inpatient Community Care Network copay`,
    amount: 60,
  },
];

const fields = [
  { label: 'Statement date', value: 'date' },
  { label: 'Description', value: 'desc' },
  { label: 'Amount', value: 'amount' },
];

const PaymentHistoryTable = () => {
  const [page, setPage] = useState(1);
  const pages = Math.ceil(mockData.length / MAX_ROWS_PER_PAGE);
  const start = (page - 1) * MAX_ROWS_PER_PAGE;
  const end = Math.min(page * MAX_ROWS_PER_PAGE, mockData.length);
  const currentPage = mockData.slice(start, end);
  const formattedData = formatTableData(currentPage);

  const onPageSelect = useCallback(
    selectedPage => {
      setPage(selectedPage);
    },
    [setPage],
  );

  return (
    <article className="vads-u-padding--0">
      <h2 className="vads-u-margin-top--2" id="payment-history">
        Your charges and payments
      </h2>
      <div className="charge-detail-group">
        <div className="charge-detail-col">
          <div>Amount owed</div>
          <div className="charge-detail-value">$300.00</div>
        </div>
        <div className="charge-detail-col">
          <div>Full payment due by</div>
          <div className="charge-detail-value">July 3, 2021</div>
        </div>
      </div>
      <div className="vads-u-margin-bottom--2">
        <Table
          data={formattedData}
          fields={fields}
          ariaLabelledBy="payment-history-table"
        />
        <Pagination
          page={page}
          pages={pages}
          showLastPage
          maxPageListLength={MAX_ROWS_PER_PAGE}
          onPageSelect={onPageSelect}
        />
      </div>
    </article>
  );
};

export default PaymentHistoryTable;
