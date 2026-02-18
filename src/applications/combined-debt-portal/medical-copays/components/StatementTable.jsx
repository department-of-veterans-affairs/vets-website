import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  formatDate,
  formatISODateToMMDDYYYY,
  setPageFocus,
  showVHAPaymentHistory,
} from '../../combined/utils/helpers';

const StatementTable = ({ charges, formatCurrency, selectedCopay }) => {
  const shouldShowVHAPaymentHistory = showVHAPaymentHistory(
    useSelector(state => state),
  );
  const columns = ['Date', 'Description', 'Billing Reference', 'Amount'];

  const MAX_ROWS = 10;

  const paginate = (array, pageSize, pageNumber) => {
    return array?.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  };

  const getPaginationText = (
    currentPage,
    pageSize,
    totalItems,
    label = 'charges',
  ) => {
    if (totalItems === 0) {
      return `Showing 0 ${label}`;
    }

    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);

    return `Showing ${start}-${end} of ${totalItems} ${label}`;
  };

  const normalizedCharges = shouldShowVHAPaymentHistory
    ? charges.map(item => ({
        date: item.datePosted,
        description: item.description,
        reference: item.billingReference,
        amount: item.priceComponents?.[0]?.amount ?? 0,
        provider: item.providerName,
        details: [],
      }))
    : charges.map(charge => ({
        date: charge.pDDatePostedOutput,
        description: charge.pDTransDescOutput,
        reference: charge.pDRefNo,
        amount: charge.pDTransAmt,
        provider: charge.provider,
        details: charge.details ?? [],
      }));

  const [currentData, setCurrentData] = useState(
    paginate(normalizedCharges, MAX_ROWS, 1),
  );
  const [currentPage, setCurrentPage] = useState(1);

  function onPageChange(page) {
    setCurrentData(paginate(normalizedCharges, MAX_ROWS, page));
    setCurrentPage(page);
    setPageFocus(`va-table`);
  }

  const numPages = Math.ceil(normalizedCharges?.length / MAX_ROWS);

  const paginationText = getPaginationText(
    currentPage,
    MAX_ROWS,
    normalizedCharges?.length,
    'charges',
  );

  const getStatementDateRange = () => {
    if (
      !selectedCopay?.statementStartDate ||
      !selectedCopay?.statementEndDate
    ) {
      if (normalizedCharges?.length > MAX_ROWS) {
        return `This statement shows your current charges. ${paginationText}.`;
      }
      return 'This statement shows your current charges.';
    }

    const startDate = formatDate(selectedCopay.statementStartDate);
    const endDate = formatDate(selectedCopay.statementEndDate);

    if (normalizedCharges?.length > MAX_ROWS) {
      return `This statement shows charges you received between ${startDate} and ${endDate}. ${paginationText}.`;
    }
    return `This statement shows charges you received between ${startDate} and ${endDate}.`;
  };
  const renderDescription = charge => (
    <div>
      <div>
        <strong>{charge.description?.replace(/&nbsp;/g, ' ')}</strong>
      </div>
      {charge.provider && (
        <div
          className="vads-u-color--gray-medium vads-u-font-size--sm"
          data-testid="provider-info"
        >
          Provider: {charge.provider}
        </div>
      )}
      {charge.rxNumber && (
        <div className="vads-u-color--gray-medium vads-u-font-size--sm">
          RX#: {charge.rxNumber}
        </div>
      )}
      {charge.supplyInfo && (
        <div className="vads-u-color--gray-medium vads-u-font-size--sm">
          {charge.supplyInfo}
        </div>
      )}
      {charge.prescribedBy && (
        <div className="vads-u-color--gray-medium vads-u-font-size--sm">
          Prescribed by {charge.prescribedBy}
        </div>
      )}
      {charge.details?.map((detail, index) => (
        <div
          key={index}
          className="vads-u-color--gray-medium vads-u-font-size--sm"
        >
          {detail}
        </div>
      ))}
    </div>
  );

  const getDate = charge => {
    if (shouldShowVHAPaymentHistory) {
      return formatISODateToMMDDYYYY(charge.date);
    }

    if (charge.date) {
      return formatDate(charge.date);
    }

    if (charge.description?.toLowerCase().includes('interest/adm')) {
      return selectedCopay?.pSStatementDateOutput;
    }

    return '—';
  };

  const getReference = charge => {
    if (charge.reference) return charge.reference;

    if (charge.description?.toLowerCase().includes('interest/adm')) {
      return selectedCopay?.pSStatementVal;
    }

    return '—';
  };

  return (
    <>
      <h2
        data-testid="statement-charges-head"
        id="statement-charges"
        className="vads-u-margin-bottom--0"
      >
        Most recent statement charges
      </h2>

      <div key={`table-wrapper-${currentPage}`}>
        <va-table
          table-title={getStatementDateRange()}
          table-title-summary={paginationText}
          scrollable={false}
          table-type="bordered"
          full-width
          unbounded
        >
          <va-table-row>
            {columns.map((col, index) => (
              <span key={`table-header-${index}`}>{col}</span>
            ))}
          </va-table-row>

          {currentData
            .filter(
              charge =>
                typeof charge.description === 'string' &&
                !charge.description.startsWith('&nbsp;'),
            )
            .map((charge, index) => (
              <va-table-row key={`${charge.pDRefNo || index}`}>
                <span data-testId="statement-date">{getDate(charge)}</span>
                <span data-testId="statement-description">
                  {renderDescription(charge)}
                </span>
                <span data-testId="statement-reference">
                  {getReference(charge)}
                </span>
                <span data-testId="statement-transaction-amount">
                  {formatCurrency(charge.amount)}
                </span>
              </va-table-row>
            ))}
        </va-table>
      </div>

      {normalizedCharges.length > MAX_ROWS ? (
        <VaPagination
          onPageSelect={e => onPageChange(e.detail.page)}
          page={currentPage}
          pages={numPages}
        />
      ) : null}
    </>
  );
};

StatementTable.propTypes = {
  formatCurrency: PropTypes.func.isRequired,
  charges: PropTypes.arrayOf(
    PropTypes.shape({
      details: PropTypes.arrayOf(PropTypes.string),
      pDDatePosted: PropTypes.string,
      pDDatePostedOutput: PropTypes.string,
      pDRefNo: PropTypes.string,
      pDTransAmt: PropTypes.number,
      pDTransAmtOutput: PropTypes.string,
      pDTransDesc: PropTypes.string,
      pDTransDescOutput: PropTypes.string,
      prescribedBy: PropTypes.string,
      provider: PropTypes.string,
      rxNumber: PropTypes.string,
      supplyInfo: PropTypes.string,
    }),
  ),
  selectedCopay: PropTypes.shape({
    pHNewBalance: PropTypes.number,
    pHPrevBal: PropTypes.number,
    pHTotCredits: PropTypes.number,
    pSStatementDateOutput: PropTypes.string,
    pSStatementVal: PropTypes.string,
    statementEndDate: PropTypes.string,
    statementStartDate: PropTypes.string,
  }),
};

export default StatementTable;
