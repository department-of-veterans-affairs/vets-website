import React from 'react';
import environment from 'platform/utilities/environment';

export default function RequestExpressCare() {
  const legacyLink = `https://veteran.apps${
    environment.isProduction() ? '' : '-staging'
  }.va.gov/var/v4/#new-express-request`;

  return (
    <div className="vads-u-padding-y--3 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-lighter">
      <h2 className="vads-u-font-size--h3 vads-u-margin-y--0">
        Create a new Express Care request
      </h2>
      <p>
        Do you have a health concern that you need help with today, but it isn't
        an emergency? Submit a request for a same-day Express Care screening
        with a VA health care provider.
        <ul>
          <li>
            You can submit your request [Day] through [Day], [Hours] to [Hours]
            a.m. [time zone].
          </li>
          <li>A VA health care provider will call you today.</li>
          <li>
            After your screening, we may schedule a follow-up phone, video, or
            in-person visit or other care if needed.
          </li>
        </ul>
      </p>
      <a
        className="usa-button"
        href={legacyLink}
        target="_blank"
        rel="noreferrer nofollow"
      >
        Request Express Care
      </a>
    </div>
  );
}
