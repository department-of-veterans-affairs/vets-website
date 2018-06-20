import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import {
  LOW_CONFIDENCE_ADDRESS_ERROR_CODES
} from  '../util/transactions';

function hasError(errors, codes) {
  return errors.some(error => codes.has(error.code));
}

export default function Vet360EditModalErrorMessage({ error: { errors = [] }, clearErrors, title }) {
  let content = null;

  switch (true) {
    case hasError(LOW_CONFIDENCE_ADDRESS_ERROR_CODES, errors):
      content = <p>We’re sorry. We looked up the address you entered and we're not sure mail can be delivered there. Please try entering your address again.</p>;
      break;

    default:
      content = <p>We’re sorry. We couldn’t update your {title.toLowerCase()}. Please try again.</p>;
  }

  return (
    <AlertBox
      isVisible
      status="error"
      content={content}
      onCloseAlert={clearErrors}/>
  );
}
