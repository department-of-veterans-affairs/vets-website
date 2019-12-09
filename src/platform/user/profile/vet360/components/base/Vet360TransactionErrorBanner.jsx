import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import facilityLocator from 'applications/facility-locator/manifest.json';

import {
  hasGenericUpdateError,
  hasMVIError,
  hasMVINotFoundError,
} from 'vet360/util/transactions';

export function GenericUpdateError(props) {
  return (
    <AlertBox
      {...props}
      className="vads-u-margin-bottom--4"
      status="error"
      headline="Your recent profile update didn’t save"
      content="We’re sorry. Something went wrong on our end and we couldn’t save the
      recent updates you made to your profile. Please try again later."
    />
  );
}

export function MVILookupFailError(props) {
  return (
    <AlertBox
      {...props}
      className="vads-u-margin-bottom--4"
      status="error"
      headline="We’re having trouble matching your information to our Veteran records"
      content={
        <div>
          <p>
            We’re sorry. We’re having trouble matching your information to our
            Veteran records, so we can’t give you access to tools for managing
            your health and benefits.
          </p>
          <a href={facilityLocator.rootUrl}>
            Find your nearest VA medical center
          </a>
        </div>
      }
    />
  );
}

export function MVIError(props) {
  return (
    <AlertBox
      {...props}
      className="vads-u-margin-bottom--4"
      status="error"
      headline="We can’t access your contact information right now"
      content="We’re sorry. Something went wrong on our end. Please refresh this page or try again later."
    />
  );
}

export default function Vet360TransactionErrorBanner({
  transaction,
  clearTransaction,
}) {
  let TransactionError = null;

  switch (true) {
    case hasMVINotFoundError(transaction):
      TransactionError = MVILookupFailError;
      break;

    case hasMVIError(transaction):
      TransactionError = MVIError;
      break;

    case hasGenericUpdateError(transaction):
    default:
      TransactionError = GenericUpdateError;
  }

  return <TransactionError onCloseAlert={clearTransaction} isVisible />;
}
