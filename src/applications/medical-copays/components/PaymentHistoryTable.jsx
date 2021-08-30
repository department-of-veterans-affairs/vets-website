import React, { useState, useCallback, useEffect } from 'react';
import Pagination from '@department-of-veterans-affairs/component-library/Pagination';
import SortableTable from '../components/SortableTable';
import { currency } from '../utils/helpers';

export const MAX_ROWS_PER_PAGE = 6;

const fields = [
  { label: 'Statement date', value: 'date', sortable: true },
  { label: 'Description', value: 'desc', sortable: true },
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
    amount: 56,
  },
  {
    date: 'April 22, 2021',
    desc: 'Inpatient Community Care Network copay for May 5, 2021',
    amount: 60,
  },
  {
    date: 'August 2, 2021',
    desc: 'Late fee',
    amount: 3,
  },
  {
    date: 'March 13, 2021',
    desc: 'Prescription copay (service connected)',
    amount: 10,
  },
  {
    date: 'June 3, 2021',
    desc: 'Inpatient Community Care Network copay for May 5, 2021',
    amount: 110,
  },
  {
    date: 'May 7, 2021',
    desc: 'Payments made from April 3, 2021 to May 3, 2021',
    amount: 101,
  },
  {
    date: 'April 22, 2021',
    desc: 'Inpatient Community Care Network copay for May 5, 2021',
    amount: 60,
  },
  {
    date: 'August 2, 2021',
    desc: 'Late fee',
    amount: 5,
  },
  {
    date: 'March 13, 2021',
    desc: 'Prescription copay (service connected)',
    amount: 10,
  },
  {
    date: 'June 3, 2021',
    desc: 'Inpatient Community Care Network copay for May 5, 2021',
    amount: 490,
  },
  {
    date: 'May 7, 2021',
    desc: 'Payments made from April 3, 2021 to May 3, 2021',
    amount: 76,
  },
  {
    date: 'April 22, 2021',
    desc: 'Inpatient Community Care Network copay for May 5, 2021',
    amount: 60,
  },
  {
    date: 'August 2, 2021',
    desc: 'Late fee',
    amount: 4,
  },
  {
    date: 'March 13, 2021',
    desc: 'Prescription copay (service connected)',
    amount: 10,
  },
  {
    date: 'June 3, 2021',
    desc: 'Inpatient Community Care Network copay for May 5, 2021',
    amount: 77,
  },
  {
    date: 'May 7, 2021',
    desc: 'Payments made from April 3, 2021 to May 3, 2021',
    amount: 102,
  },
  {
    date: 'April 22, 2021',
    desc: 'Inpatient Community Care Network copay for May 5, 2021',
    amount: 58,
  },
  {
    date: 'August 2, 2021',
    desc: 'Late fee',
    amount: 6,
  },
  {
    date: 'March 13, 2021',
    desc: 'Prescription copay (service connected)',
    amount: 45,
  },
  {
    date: 'June 3, 2021',
    desc: 'Inpatient Community Care Network copay for May 5, 2021',
    amount: 65,
  },
  {
    date: 'May 7, 2021',
    desc: 'Payments made from April 3, 2021 to May 3, 2021',
    amount: 22,
  },
  {
    date: 'April 22, 2021',
    desc: 'Inpatient Community Care Network copay for May 5, 2021',
    amount: 60,
  },
  {
    date: 'August 2, 2021',
    desc: 'Late fee',
    amount: 9,
  },
  {
    date: 'March 13, 2021',
    desc: 'Prescription copay (service connected)',
    amount: 10,
  },
  {
    date: 'June 3, 2021',
    desc: 'Inpatient Community Care Network copay for May 5, 2021',
    amount: 95,
  },
  {
    date: 'May 7, 2021',
    desc: 'Payments made from April 3, 2021 to May 3, 2021',
    amount: 64,
  },
  {
    date: 'April 22, 2021',
    desc: 'Inpatient Community Care Network copay for May 5, 2021',
    amount: 13,
  },
  {
    date: 'August 2, 2021',
    desc: 'Late fee',
    amount: 1,
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
  const [tableData, setTableData] = useState(data);
  const [sort, setSort] = useState({ value: 'date', order: 'DESC' });
  const pages = Math.ceil(tableData.length / MAX_ROWS_PER_PAGE);
  const start = (page - 1) * MAX_ROWS_PER_PAGE;
  const end = Math.min(page * MAX_ROWS_PER_PAGE, tableData.length);
  const currentPage = tableData.slice(start, end);

  const handleSort = useCallback(
    sortOrder => {
      const sortedData = data.sort((a, b) => {
        return sortOrder.order === 'ASC'
          ? b.amount - a.amount
          : a.amount - b.amount;
      });

      setSort(sortOrder);
      setTableData(sortedData);
    },
    [setSort],
  );

  const onPageSelect = useCallback(
    selectedPage => {
      setPage(selectedPage);
    },
    [setPage],
  );

  useEffect(() => {}, []);

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
        <SortableTable
          data={formatTableData(currentPage)}
          fields={fields}
          sort={sort}
          handleSort={handleSort}
        />
        <Pagination
          page={page}
          pages={pages}
          showLastPage
          maxPageListLength={MAX_ROWS_PER_PAGE}
          onPageSelect={onPageSelect}
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
