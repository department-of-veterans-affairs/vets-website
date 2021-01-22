import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';
import facilityLocator from '~/applications/facility-locator/manifest.json';

import {
  hasGenericUpdateError,
  hasMVIError,
  hasMVINotFoundError,
  hasVAProfileInitError,
} from '@@vap-svc/util/transactions';

export function GenericUpdateError(props) {
  return (
    <AlertBox
      {...props}
      className="vads-u-margin-top--0 vads-u-margin-bottom--4"
      status="error"
      headline="Your recent profile update didn’t save"
      content="We’re sorry. Something went wrong on our end and we couldn’t save the
      recent updates you made to your profile. Please try again later."
    />
  );
}

export function VAProfileInitError(props) {
  return (
    <AlertBox
      {...props}
      className="vads-u-margin-top--0 vads-u-margin-bottom--4"
      status="error"
      headline="We can’t load some of your information"
      content={
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
            Contact us at <Telephone contact={CONTACTS.MY_HEALTHEVET} />. We’re
            here Monday - Friday, 8:00 a.m - 8:00 p.m. ET. If you have hearing
            loss, call <Telephone contact="800-877-3399" />. Tell the
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
            <strong>
              To find out if this is about an account with the Department of
              Defense:
            </strong>
          </p>
          <p>
            You can{' '}
            <a
              href="https://www.accesstocare.va.gov/sign-in-help"
              target="_blank"
              rel="noopener noreferrer"
            >
              submit a request to get help signing in
            </a>
            .{' '}
          </p>
        </div>
      }
    />
  );
}

export function MVILookupFailError(props) {
  return (
    <AlertBox
      {...props}
      className="vads-u-margin-top--0 vads-u-margin-bottom--4"
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
      className="vads-u-margin-top--0 vads-u-margin-bottom--4"
      status="error"
      headline="We can’t access your contact information right now"
      content="We’re sorry. Something went wrong on our end. Please refresh this page or try again later."
    />
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

  return <TransactionError onCloseAlert={clearTransaction} isVisible />;
}
