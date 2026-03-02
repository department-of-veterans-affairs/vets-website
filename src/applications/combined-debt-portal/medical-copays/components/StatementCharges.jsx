import React from 'react';
import PropTypes from 'prop-types';
import { subDays } from 'date-fns';
import { formatDate } from '../../combined/utils/helpers';

const StatementCharges = ({ copay, showCurrentStatementHeader = false }) => {
  const initialDate = new Date(copay.pSStatementDateOutput);
  const statementDate = formatDate(initialDate);
  const previousCopayStartDate = formatDate(subDays(initialDate, 30));

  const tableData = copay.details.map(item => {
    return (
      <va-table-row
        key={`${item.pDRefNo}-${item.pDTransAmtOutput
          .replace('&nbsp', '')
          .replace('-', '')
          .replace(/[^\d.-]/g, '')}`}
      >
        <span data-testId="statement-charges-description">
          {item.pDTransDescOutput.replace(/&nbsp;/g, '')}
        </span>
        <span
          data-testId="statement-charges-reference"
          className="vads-u-width--fit"
        >
          {item.pDRefNo}
        </span>
        <span
          data-testId="statement-charges-transaction-amount"
          className="vads-u-width--fit"
        >
          $
          {item.pDTransAmtOutput
            .replace('&nbsp', '')
            .replace('-', '')
            .replace(/[^\d.-]/g, '')}
        </span>
      </va-table-row>
    );
  });
  const transactionHistoryTableTitle = `This statement shows charges you received between 
        ${previousCopayStartDate} and ${statementDate}.`;

  return (
    <>
      <h2
        data-testid="statement-charges-head"
        id="statement-charges"
        className="vads-u-margin-bottom--0"
      >
        {showCurrentStatementHeader
          ? 'Most recent statement charges'
          : 'Statement Charges'}
      </h2>

      <va-table
        data-testid="statement-charges-table"
        table-title={transactionHistoryTableTitle}
        uswds
        table-type="bordered"
      >
        <va-table-row slot="headers">
          <span>Description</span>
          <span className="vads-u-width--fit"> Billing reference</span>
          <span className="vads-u-width--fit">Amount</span>
        </va-table-row>
        {tableData}
      </va-table>
    </>
  );
};

StatementCharges.propTypes = {
  copay: PropTypes.object,
  showCurrentStatementHeader: PropTypes.bool,
};

export default StatementCharges;
