import React from 'react';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

const SERVER_ERROR_REGEX = /^5\d{2}$/;
const CLIENT_ERROR_REGEX = /^4\d{2}$/;

export const isServerError = errCode => SERVER_ERROR_REGEX.test(errCode);
export const isClientError = errCode => CLIENT_ERROR_REGEX.test(errCode);

export const ClientErrorAlertContent = (
  <>
    <h2 className="vads-u-margin-y--0 vads-u-font-size--lg">
      We don’t have a record of VA payments made to you
    </h2>
    <p>
      We can't find any VA payments made to you. Some details may not be
      available online. For example, payments less than $1 for direct deposit,
      or $5 for mailed checks, will not show in your online payment history.
    </p>
    <p>
      VA pays benefits on the first day of the month for the previous month.
      Please wait at least 3 business days (Monday-Friday) before reporting
      non-receipt of a payment.
    </p>
  </>
);

export const ServerErrorAlertContent = (
  <>
    <h2 className="vads-u-margin-y--0 vads-u-font-size--lg">
      We’re sorry. Something went wrong on our end
    </h2>
    <p>
      Please refresh this page or check back later. You can also sign out of
      VA.gov and try signing back into this page.
    </p>
    <p>
      If you get this error again, please call the VA.gov help desk at{' '}
      <a
        href="tel:8446982311"
        aria-label="8 4 4. 6 9 8. 2 3 1 1."
        title="Dial the telephone number 844-698-2311"
      >
        844-698-2311
      </a>{' '}
      (TTY: <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />
      ). We’re here Monday-Friday, 8:00 a.m.-8:00 p.m. ET.
    </p>
  </>
);
