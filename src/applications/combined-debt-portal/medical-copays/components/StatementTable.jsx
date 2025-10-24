import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { formatDate } from '../../combined/utils/helpers';

const StatementTable = ({ charges, formatCurrency, selectedCopay }) => {
  const columns = ['Date', 'Description', 'Billing Reference', 'Amount'];

  const MAX_ROWS = 10;

  function paginate(array, pageSize, pageNumber) {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }

  function getPaginationText(
    currentPage,
    pageSize,
    totalItems,
    label = 'charges',
  ) {
    // Ensure numbers are valid
    if (totalItems === 0) {
      return `Showing 0 ${label}`;
    }

    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);

    return `Showing ${start}-${end} of ${totalItems} ${label}`;
  }

  const [currentData, setCurrentData] = useState(
    paginate(charges, MAX_ROWS, 1),
  );
  const [currentPage, setCurrentPage] = useState(1);

  function onPageChange(page) {
    setCurrentData(paginate(charges, MAX_ROWS, page));
    setCurrentPage(page);
  }

  const numPages = Math.ceil(charges.length / MAX_ROWS);

  const getStatementDateRange = () => {
    const pageText = getPaginationText(
      currentPage,
      MAX_ROWS,
      charges.length,
      'charges',
    );

    if (
      !selectedCopay?.statementStartDate ||
      !selectedCopay?.statementEndDate
    ) {
      return `This statement shows your current charges. ${pageText}.`;
    }

    const startDate = formatDate(selectedCopay.statementStartDate);
    const endDate = formatDate(selectedCopay.statementEndDate);

    return `This statement shows charges you received between ${startDate} and ${endDate}. ${pageText}.`;
  };
  const renderDescription = charge => (
    <div>
      <div>
        <strong>{charge.pDTransDescOutput.replace(/&nbsp;/g, ' ')}</strong>
      </div>
      {charge.provider && (
        <div className="vads-u-color--gray-medium vads-u-font-size--sm">
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
    if (charge.pDDatePostedOutput) return charge.pDDatePostedOutput;
    if (charge.pDTransDesc?.toLowerCase().includes('interest/adm')) {
      return selectedCopay?.pSStatementDateOutput;
    }
    return 'Empty';
  };

  const getReference = charge => {
    if (charge.pDRefNo) return charge.pDRefNo;
    if (charge.pDTransDesc?.toLowerCase().includes('interest/adm')) {
      return selectedCopay?.pSStatementVal;
    }
    return 'Empty';
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
          scrollable={false}
          mono-font-cols="1"
          table-type="bordered"
        >
          <va-table-row>
            {columns.map((col, index) => (
              <span key={`table-header-${index}`}>{col}</span>
            ))}
          </va-table-row>

          {currentData
            ?.filter(charge => !charge.pDTransDescOutput.startsWith('&nbsp;'))
            .map((charge, index) => (
              <va-table-row key={`${charge.pDRefNo || index}`}>
                <span>{getDate(charge)}</span>
                <span>{renderDescription(charge)}</span>
                <span>{getReference(charge)}</span>
                <span>{formatCurrency(charge.pDTransAmt)}</span>
              </va-table-row>
            ))}
        </va-table>
      </div>
      <VaPagination
        onPageSelect={e => onPageChange(e.detail.page)}
        page={currentPage}
        pages={numPages}
      />
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
