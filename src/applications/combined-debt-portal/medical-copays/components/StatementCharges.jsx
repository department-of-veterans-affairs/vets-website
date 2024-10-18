import React from 'react';
import PropTypes from 'prop-types';
import { subMonths } from 'date-fns';
import { formatDate } from '../../combined/utils/helpers';

const StatementCharges = ({ copay }) => {
  const initialDate = new Date();
  const today = formatDate(initialDate);
  const previousCopaysStartDate = formatDate(subMonths(initialDate, 1));

  const tableData = copay.details.map(item => {
    return (
      <va-table-row
        key={`${item.pDRefNo}-${item.pDTransAmtOutput
          .replace('&nbsp', '')
          .replace('-', '')
          .replace(/[^\d.-]/g, '')}`}
      >
        <span>{item.pDTransDescOutput.replace(/&nbsp;/g, '')}</span>
        <span>{item.pDRefNo}</span>
        <span>
          $
          {item.pDTransAmtOutput
            .replace('&nbsp', '')
            .replace('-', '')
            .replace(/[^\d.-]/g, '')}
        </span>
      </va-table-row>
    );
  });

  return (
    <>
      <h2 data-testid="statement-charges-head" id="statement-charges">
        Statement Charges
      </h2>
      <p>
        This statement shows charges you received between{' '}
        {previousCopaysStartDate} and {today}
      </p>
      <va-table data-testid="statement-charges-table">
        <va-table-row slot="headers">
          <span>Description</span>
          <span> Billing reference</span>
          <span>Amount</span>
        </va-table-row>
        {tableData}
      </va-table>
    </>
  );
};

StatementCharges.propTypes = {
  copay: PropTypes.object,
};

export default StatementCharges;
