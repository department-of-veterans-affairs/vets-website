import React from 'react';
import SortableTable from '@department-of-veterans-affairs/formation-react/SortableTable';

const PaymentsReceived = props => (
  <>
    <h3 className="vads-u-font-size--xl">Payments returned</h3>
    <p>
      Returned payment information is available for 6 years from the date the
      payment was issued.
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
