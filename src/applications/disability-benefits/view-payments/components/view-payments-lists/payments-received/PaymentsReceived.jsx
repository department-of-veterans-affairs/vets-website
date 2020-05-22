import React from 'react';
import SortableTable from '@department-of-veterans-affairs/formation-react/SortableTable';

const PaymentsReceived = props => (
  <>
    <h3 className="vads-u-font-size--xl">Payments you recieved</h3>
    <p>
      VA pays benefits on the first day of the month for the previous month. If
      the first day of the month is a weekend or holiday, VA pays benefits on
      the last business day before the 1st. For example, if May 1st is a
      Saturday, benefits would be paid on Friday, April 30.
    </p>
    <SortableTable
      className="va-table"
      currentSort={{
        value: 'String',
        order: 'ASC',
      }}
      fields={props.fields}
      data={[
        {
          id: 1,
          date: 'June 4, 2020',
          amount: '$4,321',
          type: 'Componsation & Pension Recurring',
          method: 'Direct Deposit',
          bank: 'USAA FEDERAL SAVINGS BANK',
          account: '1234567890999',
          rowClass: 'class',
        },
        {
          id: 2,
          date: 'June 3, 2020',
          amount: '$4,321',
          type: 'Componsation & Pension Recurring',
          method: 'Direct Deposit',
          bank: 'USAA FEDERAL SAVINGS BANK',
          account: '1234567890999',
          rowClass: 'class',
        },
      ]}
    />
  </>
);

export default PaymentsReceived;
