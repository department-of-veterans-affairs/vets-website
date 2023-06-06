import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const StatementCharges = ({ copay }) => {
  const initialDate = new Date();
  const today = moment(initialDate).format('MMMM D, YYYY');
  const previousCopaysStartDate = moment(initialDate)
    .subtract(1, 'month')
    .format('MMMM D, YYYY');

  const fields = [
    { label: 'Description', value: 'desc' },
    { label: 'Billing Reference', value: 'billref' },
    { label: 'Amount', value: 'amount' },
  ];

  const tableData = copay.details.map(item => ({
    desc: item.pDTransDescOutput,
    billref: item.pDRefNo,
    amount: (
      <div>
        ${item.pDTransAmtOutput.replace('-', '').replace(/[^\d.-]/g, '')}
      </div>
    ),
  }));

  return (
    <>
      <h2 data-testid="statement-charges-head" id="statement-charges">
        Statement Charges
      </h2>
      <p>
        This statement shows charges you received between{' '}
        {previousCopaysStartDate} and {today}
      </p>
      <va-table
        data-testid="statement-charges-table"
        class="statement-charges-table"
      >
        <va-table-row slot="headers">
          {fields.map(field => (
            <span key={field.value}>{field.label}</span>
          ))}
        </va-table-row>
        {tableData.map((row, index) => (
          <va-table-row key={`statement-charges-${index}`}>
            {fields.map(field => (
              <span key={`${field.value}-${index}`}>{row[field.value]}</span>
            ))}
          </va-table-row>
        ))}
      </va-table>
    </>
  );
};

StatementCharges.propTypes = {
  copay: PropTypes.object,
};

export default StatementCharges;
