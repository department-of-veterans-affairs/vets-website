import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

export default function Vet360TransactionSuccessBanner({ clearTransaction }) {
  return (
    <div data-transaction-success>
      <AlertBox
        isVisible
        status="success"
        onCloseAlert={clearTransaction}
        content={<h4>We saved your updated information.</h4>}/>
    </div>
  );
}
