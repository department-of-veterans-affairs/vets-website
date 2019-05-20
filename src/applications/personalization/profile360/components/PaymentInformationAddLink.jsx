import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function PaymentInformationAddLink({ onClick }) {
  return (
    <AlertBox
      status="info"
      isVisible
      headline="It looks like you haven't added your payment information for direct deposit."
    >
      <button className="usa-button vads-u-margin-top--2" onClick={onClick}>
        Add your payment information
      </button>
    </AlertBox>
  );
}
