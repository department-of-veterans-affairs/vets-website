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
        If you have a non-emergency health concern and want to talk to a health
        care provider today, submit a request for same-day telehealth
        appointment. The window for Express Care requests is 00:00 to 00:00 so
        we can fulfill all requests during business hours.
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
