import React, { Component } from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import SortableTable from '@department-of-veterans-affairs/formation-react/SortableTable';
import { clientServerErrorContent } from '../helpers';

const alertClasses =
  'vads-u-padding-y--2p5 vads-u-padding-right--4 vads-u-padding-left--2';

const PaymentsReturned = props => {
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
        content={clientServerErrorContent('Returned')}
        status="info"
        isVisible
      />
    );
  }
  return (
    <>
      <h3 className="vads-u-font-size--xl">Payments returned</h3>
      <p>
        Returned payment information is available for 6 years from the date the
        payment was issued.
      </p>
      {tableContent}
    </>
  );
};

export default PaymentsReturned;
