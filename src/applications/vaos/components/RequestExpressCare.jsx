import React from 'react';
import environment from 'platform/utilities/environment';

export default function RequestExpressCare() {
  const legacyLink = `https://veteran.apps${
    environment.isProduction() ? '' : '-staging'
  }.va.gov/var/v4/#new-express-request`;

  return (
    <div className="vads-u-padding-y--3 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-lighter">
      <h2 className="vads-u-font-size--h3 vads-u-margin-y--0">
        Request an Express Care screening
      </h2>
      <p>
        Have a health concern that you need help with today, but isn't an
        emergency? Submit a request for a same-day Express Care screening with a
        VA health care provider. You can sumbit your request Monday through
        Friday, 00:00 to 00:00. You'll receive a phone screening between 00:00
        and 00:00 the same day. If needed, we may schedule a follow-up phone,
        video, or in-person visit or other care.
      </p>
      <a
        className="usa-button"
        href={legacyLink}
        target="_blank"
        rel="noreferrer nofollow"
      >
        Request an Express Care screening
      </a>
    </div>
  );
}
