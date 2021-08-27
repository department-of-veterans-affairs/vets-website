import React from 'react';
import Pagination from '@department-of-veterans-affairs/component-library/Pagination';
import Table from '@department-of-veterans-affairs/component-library/Table';
import { currency } from '../utils/helpers';

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
];

const formatTableData = tableData => {
  return tableData.map(row => ({
    date: row.date,
    desc: <strong>{row.desc}</strong>,
    amount: currency(row.amount),
  }));
};

const PaymentHistoryTable = () => {
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
          currentSort={{
            value: 'date',
            order: 'ASC',
          }}
          fields={fields}
          data={formatTableData(data)}
          maxRows={5}
        />
        <Pagination
          // onPageSelect={page => handleDataPagination(page)}
          page={1}
          pages={3}
          maxPageListLength={3}
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
