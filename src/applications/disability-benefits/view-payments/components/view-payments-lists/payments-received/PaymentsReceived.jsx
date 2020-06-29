import React, { Component } from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import SortableTable from '@department-of-veterans-affairs/formation-react/SortableTable';
import { clientServerErrorContent } from '../helpers';

const alertClasses =
  'vads-u-padding-y--2p5 vads-u-padding-right--4 vads-u-padding-left--2';

const PaymentsReceived = props => {
  let tableContent = '';
  if (props.data) {
    tableContent = (
      <SortableTable
        className="va-table"
        currentSort={{
          value: 'String',
          order: 'ASC',
        }}
        fields={props.fields}
        data={props.data}
      />
    );
  } else {
    tableContent = (
      <AlertBox
        className={alertClasses}
        content={clientServerErrorContent('Received')}
        status="info"
        isVisible
      />
    );
  }
  return (
    <>
      <h3 className="vads-u-font-size--xl">Payments you received</h3>
      <p>
        VA pays benefits on the first day of the month for the previous month.
        If the first day of the month is a weekend or holiday, VA pays benefits
        on the last business day before the 1st. For example, if May 1st is a
        Saturday, benefits would be paid on Friday, April 30.
      </p>
      {tableContent}
    </>
  );
};

export default PaymentsReceived;
