import React from 'react';
import PropTypes from 'prop-types';

const StatementTable = ({ charges, formatCurrency, selectedCopay }) => {
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
    return '---';
  };

  const getReference = charge => {
    if (charge.pDRefNo) return charge.pDRefNo;
    if (charge.pDTransDesc?.toLowerCase().includes('interest/adm')) {
      return selectedCopay?.pSStatementVal;
    }
    return '---';
  };

  return (
    <va-table table-type="bordered">
      <va-table-row slot="headers">
        <span>Date</span>
        <span>Description</span>
        <span>Billing Reference</span>
        <span>Amount</span>
      </va-table-row>
      <va-table-row>
        <span>---</span>
        <span>Previous Balance</span>
        <span>---</span>
        <span>{formatCurrency(selectedCopay?.pHPrevBal)}</span>
      </va-table-row>
      {charges
        ?.filter(charge => !charge.pDTransDescOutput.startsWith('&nbsp;'))
        .map((charge, index) => (
          <va-table-row key={`${charge.pDRefNo || index}`}>
            <span>{getDate(charge)}</span>
            <span>{renderDescription(charge)}</span>
            <span>{getReference(charge)}</span>
            <span>{formatCurrency(charge.pDTransAmt)}</span>
          </va-table-row>
        ))}
      {selectedCopay?.pHTotCredits !== 0 && (
        <va-table-row>
          <span>---</span>
          <span>Total Credits</span>
          <span>---</span>
          <span>{formatCurrency(selectedCopay?.pHTotCredits)}</span>
        </va-table-row>
      )}
      <va-table-row>
        <span>---</span>
        <span>
          <strong>Current Balance</strong>
        </span>
        <span>---</span>
        <span>
          <strong>{formatCurrency(selectedCopay?.pHNewBalance)}</strong>
        </span>
      </va-table-row>
    </va-table>
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
  }),
};

export default StatementTable;
