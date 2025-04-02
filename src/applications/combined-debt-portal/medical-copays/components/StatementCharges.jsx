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
        <span className="vads-u-width--fit">{item.pDRefNo}</span>
        <span className="vads-u-width--fit">
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
    <article className="vads-u-padding-x--0">
      <h2 data-testid="statement-charges-head" id="statement-charges">
        Statement Charges
      </h2>
      <p className="vads-u-margin-bottom--0">
        This statement shows charges you received between{' '}
        {previousCopaysStartDate} and {today}.
      </p>
      <va-table
        data-testid="statement-charges-table"
        table-title="Transaction history"
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
    </article>
  );
};

StatementCharges.propTypes = {
  copay: PropTypes.object,
};

export default StatementCharges;
