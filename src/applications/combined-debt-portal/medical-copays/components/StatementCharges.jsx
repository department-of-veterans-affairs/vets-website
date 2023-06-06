import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const StatementCharges = ({ copay }) => {
  const initialDate = new Date();
  const today = moment(initialDate).format('MMMM D, YYYY');
  const previousCopaysStartDate = moment(initialDate)
    .subtract(1, 'month')
    .format('MMMM D, YYYY');

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
      <va-table role="table">
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
