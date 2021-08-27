import React, { useState, useCallback } from 'react';
import Pagination from '@department-of-veterans-affairs/component-library/Pagination';
import Table from '@department-of-veterans-affairs/component-library/Table';
import { currency } from '../utils/helpers';

export const MAX_ROWS_PER_PAGE = 6;

const fields = [
  { label: 'Statement date', value: 'date' },
  { label: 'Description', value: 'desc' },
  { label: 'Amount', value: 'amount' },
];

const data = [
  {
    date: 'March 13, 2021',
    desc: 'Prescription copay (service connected)',
    amount: 10,
  },
  {
    date: 'June 3, 2021',
    desc: 'Inpatient Community Care Network copay for May 5, 2021',
    amount: 290,
  },
  {
    date: 'May 7, 2021',
    desc: 'Payments made from April 3, 2021 to May 3, 2021',
    amount: 102,
  },
  {
    date: 'April 22, 2021',
    desc: 'Inpatient Community Care Network copay for May 5, 2021',
    amount: 60,
  },
  {
    date: 'August 2, 2021',
    desc: 'Late fee',
    amount: 2,
  },
  {
    date: 'March 13, 2021',
    desc: 'Prescription copay (service connected)',
    amount: 10,
  },
  {
    date: 'June 3, 2021',
    desc: 'Inpatient Community Care Network copay for May 5, 2021',
    amount: 290,
  },
  {
    date: 'May 7, 2021',
    desc: 'Payments made from April 3, 2021 to May 3, 2021',
    amount: 102,
  },
  {
    date: 'April 22, 2021',
    desc: 'Inpatient Community Care Network copay for May 5, 2021',
    amount: 60,
  },
  {
    date: 'August 2, 2021',
    desc: 'Late fee',
    amount: 2,
  },
  {
    date: 'March 13, 2021',
    desc: 'Prescription copay (service connected)',
    amount: 10,
  },
  {
    date: 'June 3, 2021',
    desc: 'Inpatient Community Care Network copay for May 5, 2021',
    amount: 290,
  },
  {
    date: 'May 7, 2021',
    desc: 'Payments made from April 3, 2021 to May 3, 2021',
    amount: 102,
  },
  {
    date: 'April 22, 2021',
    desc: 'Inpatient Community Care Network copay for May 5, 2021',
    amount: 60,
  },
  {
    date: 'August 2, 2021',
    desc: 'Late fee',
    amount: 2,
  },
  {
    date: 'March 13, 2021',
    desc: 'Prescription copay (service connected)',
    amount: 10,
  },
  {
    date: 'June 3, 2021',
    desc: 'Inpatient Community Care Network copay for May 5, 2021',
    amount: 290,
  },
  {
    date: 'May 7, 2021',
    desc: 'Payments made from April 3, 2021 to May 3, 2021',
    amount: 102,
  },
  {
    date: 'April 22, 2021',
    desc: 'Inpatient Community Care Network copay for May 5, 2021',
    amount: 60,
  },
  {
    date: 'August 2, 2021',
    desc: 'Late fee',
    amount: 2,
  },
  {
    date: 'March 13, 2021',
    desc: 'Prescription copay (service connected)',
    amount: 10,
  },
  {
    date: 'June 3, 2021',
    desc: 'Inpatient Community Care Network copay for May 5, 2021',
    amount: 290,
  },
  {
    date: 'May 7, 2021',
    desc: 'Payments made from April 3, 2021 to May 3, 2021',
    amount: 102,
  },
  {
    date: 'April 22, 2021',
    desc: 'Inpatient Community Care Network copay for May 5, 2021',
    amount: 60,
  },
  {
    date: 'August 2, 2021',
    desc: 'Late fee',
    amount: 2,
  },
  {
    date: 'March 13, 2021',
    desc: 'Prescription copay (service connected)',
    amount: 10,
  },
  {
    date: 'June 3, 2021',
    desc: 'Inpatient Community Care Network copay for May 5, 2021',
    amount: 290,
  },
  {
    date: 'May 7, 2021',
    desc: 'Payments made from April 3, 2021 to May 3, 2021',
    amount: 102,
  },
  {
    date: 'April 22, 2021',
    desc: 'Inpatient Community Care Network copay for May 5, 2021',
    amount: 60,
  },
  {
    date: 'August 2, 2021',
    desc: 'Late fee',
    amount: 2,
  },
];

const formatTableData = tableData => {
  return tableData.map(row => ({
    date: row.date,
    desc: <strong>{row.desc}</strong>,
    amount: currency(row.amount),
  }));
};

const PaymentHistoryTable = () => {
  const [page, setPage] = useState(1);
  const pages = Math.ceil(data.length / MAX_ROWS_PER_PAGE);
  const start = (page - 1) * MAX_ROWS_PER_PAGE;
  const end = Math.min(page * MAX_ROWS_PER_PAGE, data.length);
  const currentPage = data.slice(start, end);

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
      <div className="payment-history-table">
        <Table
          fields={fields}
          data={formatTableData(currentPage)}
          currentSort={{
            value: 'date',
            order: 'ASC',
          }}
        />
        <Pagination
          onPageSelect={onPageSelect}
          page={page}
          pages={pages}
          maxPageListLength={MAX_ROWS_PER_PAGE}
          showLastPage
        />
      </div>
      <p>
        <a href="#">
          <i
            className="fas fa-download vads-u-margin-right--1"
            aria-hidden="true"
          />
          Download your June 3, 2021 statement (PDF)
        </a>
      </p>
    </article>
  );
};

export default PaymentHistoryTable;
