import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import {
  hasGenericUpdateError,
  hasLowCondidenceAddressError,
  hasMVIError,
  hasMVINotFoundError,
  hasUserIsDeceasedError
} from '../util/transactions';

export function GenericUpdateError(props) {
  return (
    <AlertBox {...props}
      status="error"
      content={(
        <div>
          <h4>Your recent profile update didn’t save</h4>
          <p>We’re sorry. Something went wrong on our end and we couldn’t save the recent updates you made to your profile. Please try again later.</p>
        </div>
      )}/>
  );
}

export function LowConfidenceError(props) {
  return (
    <AlertBox {...props}
      status="error"
      content={(
        <div>
          <h4>Your address didn’t save</h4>
          <p>We’re sorry. We looked up the address you entered, and we’re not sure mail can be delivered there. Please try entering your address again.</p>
        </div>
      )}/>
  );
}

export function MVILookupFailError(props) {
  return (
    <AlertBox {...props}
      status="error"
      content={(
        <div>
          <h4>We’re having trouble matching your information to our Veteran records</h4>
          <p>We’re sorry. We’re having trouble matching your information to our Veteran records, so we can’t give you access to tools for managing your health and benefits.</p>
          <a href="/facilities/">Find your nearest VA medical center</a>
        </div>
      )}/>
  );
}

export function MVIError(props) {
  return (
    <AlertBox {...props}
      status="error"
      content={(
        <div>
          <h4>We can’t access your contact information right now.</h4>
          <p>We’re sorry. Something went wrong on our end. Please refresh this page or try again later.</p>
        </div>
      )}/>
  );
}

export function UserIsDeceasedError(props) {
  return (
    <AlertBox {...props}
      status="error"
      content={(
        <div>
          <h4>We can’t accept updates to this profile</h4>
          <p>We’re sorry. We’ve locked this profile because our records show the Veteran is deceased. If this is an error, please contact your nearest VA medical center. Let them know you need to fix this information in your records. The operator, or a patient advocate, can connect you with the right person who can help.</p>
          <a href="/facilities/">Find your nearest VA medical center</a>
        </div>
      )}/>
  );
}

export default function Vet360TransactionErrorBanner({ transaction, clearTransaction }) {
  let TransactionError = null;

  switch (true) {
    case hasUserIsDeceasedError(transaction):
      TransactionError = UserIsDeceasedError;
      break;

    case hasMVINotFoundError(transaction):
      TransactionError = MVILookupFailError;
      break;

    case hasMVIError(transaction):
      TransactionError = MVIError;
      break;

    case hasLowCondidenceAddressError(transaction):
      TransactionError = LowConfidenceError;
      break;

    case hasGenericUpdateError(transaction):
    default:
      TransactionError = GenericUpdateError;
  }

  return <TransactionError onCloseAlert={clearTransaction} isVisible/>;
}
