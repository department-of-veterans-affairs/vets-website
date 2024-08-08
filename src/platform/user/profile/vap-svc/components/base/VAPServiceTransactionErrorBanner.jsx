import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { getAppUrl } from 'platform/utilities/registry-helpers';

import {
  hasGenericUpdateError,
  hasMVIError,
  hasMVINotFoundError,
  hasVAProfileInitError,
} from 'platform/user/profile/vap-svc/util/transactions';

export function GenericUpdateError(props) {
  return (
    <VaAlert {...props} uswds>
      <h3 slot="headline">Your recent profile update didn’t save</h3>
      We’re sorry. Something went wrong on our end and we couldn’t save the
      recent updates you made to your profile. Please try again later.
    </VaAlert>
  );
}

export function VAProfileInitError(props) {
  return (
    <VaAlert {...props} uswds>
      <h3 slot="headline">We can’t load some of your information</h3>
      <div>
        <p>
          We’re sorry. We can’t load some of the information in your profile.
          This may be because you have multiple IDs or accounts at VA.
        </p>
        <p>
          <strong>
            To find out if this about an account on My HealtheVet:
          </strong>
        </p>
        <p>
          Contact us at <va-telephone contact={CONTACTS.MY_HEALTHEVET} />. We’re
          here Monday - Friday, 8:00 a.m - 8:00 p.m. ET. If you have hearing
          loss, call <va-telephone contact="8008773399" />. Tell the
          representative that you tried to sign in to VA.gov, but got an error
          message that you may have more than one My HealtheVet account or ID.
        </p>
        <p>
          Or, you can{' '}
          <a
            href="https://www.myhealth.va.gov/mhv-portal-web/contact-us"
            target="_blank"
            rel="noopener noreferrer"
          >
            fill out a My HealtheVet online help form
          </a>{' '}
          to get help signing in.
        </p>
        <p>
          To find out if this is about an account with the Department of
          Defense, call our MyVA411 main information line for help at
          <va-telephone contact={CONTACTS.HELP_DESK} /> (
          <va-telephone contact={CONTACTS['711']} tty />
          ).
        </p>
      </div>
    </VaAlert>
  );
}

export function MVILookupFailError(props) {
  return (
    <VaAlert {...props} uswds>
      <h3 slot="headline">
        We’re having trouble matching your information to our Veteran records
      </h3>
      <div>
        <p>
          We’re sorry. We’re having trouble matching your information to our
          Veteran records, so we can’t give you access to tools for managing
          your health and benefits.
        </p>
        <a href={getAppUrl('facilities')}>
          Find your nearest VA medical center
        </a>
      </div>
    </VaAlert>
  );
}

export function MVIError(props) {
  return (
    <VaAlert {...props} uswds>
      <h3 slot="headline">
        We can’t access your contact information right now
      </h3>
      We’re sorry. Something went wrong on our end. Please refresh this page or
      try again later.
    </VaAlert>
  );
}

export default function VAPServiceTransactionErrorBanner({
  transaction,
  clearTransaction,
}) {
  let TransactionError = null;

  switch (true) {
    case hasVAProfileInitError(transaction):
      TransactionError = VAProfileInitError;
      break;

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

  return (
    <TransactionError
      className="vads-u-margin-top--0 vads-u-margin-bottom--4"
      status="error"
      onCloseEvent={clearTransaction}
      visible
      closeable
    />
  );
}
