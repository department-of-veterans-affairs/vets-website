import React, { useState } from 'react';
import last from 'lodash/last';
import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { deductionCodes } from '../const/deduction-codes';
import { currency } from '../utils/page';
import { formatDate, setPageFocus } from '../../combined/utils/helpers';

const PaymentHistoryTable = ({ currentDebt }) => {
  const columns = ['Date', 'Description', 'Amount'];
  const MAX_ROWS = 10;

  const getFirstPaymentDateFromCurrentDebt = debt => {
    const firstPaymentDate = last(debt.fiscalTransactionData)?.transactionDate;
    if (firstPaymentDate === '') return 'N/A';
    return firstPaymentDate;
  };

  const getPaymentHistoryDescription = transactionDescription => {
    if (
      transactionDescription.startsWith('Increase to AR') ||
      transactionDescription.startsWith('Increase to New AR')
    ) {
      return 'Balance increase';
    }
    if (transactionDescription.startsWith('AR Decrease')) {
      return 'Balance decrease';
    }
    if (transactionDescription.includes('Write Off')) {
      return 'Write Off';
    }
    if (
      transactionDescription.includes('Reversal') ||
      transactionDescription.includes('TOP Reversal')
    ) {
      return 'Reversal';
    }
    return 'Other';
  };

  const renderPaymentHistoryDescription = transactionDescription => {
    return (
      <>
        <p className="vads-u-margin--0 vads-u-font-size-md">
          <strong>
            {getPaymentHistoryDescription(transactionDescription)}
          </strong>
        </p>
      </>
    );
  };
  const { fiscalTransactionData } = currentDebt;

  function paginate(array, pageSize, pageNumber) {
    return fiscalTransactionData.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize,
    ).length;
  }

  function getPaginationText(
    currentPage,
    pageSize,
    totalItems,
    label = 'transactions',
  ) {
    // Ensure numbers are valid
    if (totalItems === 0) {
      return `Showing 0 ${label}`;
    }

    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);

    return `Showing ${start}-${end} ${label}`;
  }

  const [currentData, setCurrentData] = useState(
    paginate(fiscalTransactionData, MAX_ROWS, 1),
  );

  const [currentPage, setCurrentPage] = useState(1);

  function onPageChange(page) {
    setCurrentData(paginate(currentDebt, MAX_ROWS, page));
    setCurrentPage(page);
    setPageFocus(`va-table`);
  }

  const numPages = Math.ceil(currentData.length / MAX_ROWS);

  const getStatementDateRange = () => {
    const pageText = getPaginationText(
      currentPage,
      MAX_ROWS,
      fiscalTransactionData.length,
    );

    if (fiscalTransactionData.length > MAX_ROWS) {
      return `This statement shows your current charges. ${pageText}.`;
    }
    return 'This statement shows your current charges.';
  };

  if (fiscalTransactionData?.length === 0) {
    return null;
  }
  return (
    <div>
      <va-table
        table-title={getStatementDateRange()}
        uswds
        table-type="bordered"
      >
        <va-table-row slot="headers">
          {columns.map((col, index) => (
            <span key={`table-header-${index}`}>{col}</span>
          ))}
        </va-table-row>
        {fiscalTransactionData?.map((payment, index) => (
          <va-table-row key={`${payment.transactionDate}-${index}`}>
            <span className="vads-u-width--fit">
              {formatDate(payment.transactionDate)}
            </span>
            <span>
              <div className="vads-u-margin-top--0">
                {renderPaymentHistoryDescription(
                  payment.transactionDescription,
                )}
              </div>
            </span>
            <span>
              {currency.format(parseFloat(payment.transactionTotalAmount))}
            </span>
          </va-table-row>
        ))}
        <va-table-row>
          {/* This is the default row that will always be displayed for initial
          debt creation */}
          <span className="vads-u-width--fit">
            {formatDate(getFirstPaymentDateFromCurrentDebt(currentDebt))}
          </span>
          <span>
            <strong>
              {deductionCodes[currentDebt.deductionCode] ||
                currentDebt.benefitType}
            </strong>
          </span>
          <span>{currency.format(parseFloat(currentDebt.originalAr))}</span>
        </va-table-row>
      </va-table>

      {fiscalTransactionData > MAX_ROWS ? (
        <VaPagination
          onPageSelect={e => onPageChange(e.detail.page)}
          page={currentPage}
          pages={numPages}
        />
      ) : null}
    </div>
  );
};

PaymentHistoryTable.propTypes = {
  currentDebt: PropTypes.shape({
    fiscalTransactionData: PropTypes.arrayOf(
      PropTypes.shape({
        transactionDate: PropTypes.string.isRequired,
        transactionDescription: PropTypes.string.isRequired,
        transactionTotalAmount: PropTypes.number.isRequired,
      }),
    ).isRequired,
    deductionCode: PropTypes.string,
    benefitType: PropTypes.string,
    originalAr: PropTypes.string,
  }),
};

export default PaymentHistoryTable;
