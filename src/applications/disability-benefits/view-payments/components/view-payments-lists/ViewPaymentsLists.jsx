import React from 'react';
import PaymentsReceived from './payments-received/PaymentsReceived.jsx';
import PaymentsReturned from './payments-returned/PaymentsReturned.jsx';
import { fields } from './helpers';

const ViewPaymentsLists = () => (
  <>
    <PaymentsReceived fields={fields} />
    <p>
      <strong>Note:</strong> Some details about payments may not be available
      online. For example, payments less than $1 for direct deposit, or $5 for
      mailed checks, will not show in your online payment history. Gross
      payments and modifications will show only for recurring and irregular
      compensation payments. If you have questions about payments made by VA,
      please call the VA Help Desk at{' '}
      <a href="tel:8008271000" aria-label="1. 800. 827. 1000">
        800-827-1000
      </a>
      .
    </p>
    <PaymentsReturned fields={fields} />
  </>
);

export default ViewPaymentsLists;
