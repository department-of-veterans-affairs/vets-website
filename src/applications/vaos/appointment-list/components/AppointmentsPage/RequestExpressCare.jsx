import React from 'react';
import environment from 'platform/utilities/environment';
import { Link } from 'react-router-dom';
import { FETCH_STATUS } from '../../../utils/constants';

export default function RequestExpressCare({
  windowsStatus,
  enabled,
  hasWindow,
  allowRequests,
  localWindowString,
  localNextAvailableString,
  useNewFlow,
  startNewExpressCareFlow,
}) {
  const legacyLink = `https://veteran.apps${
    environment.isProduction() ? '' : '-staging'
  }.va.gov/var/v4/#new-express-request`;

  const buttonText = 'Request Express Care';

  if (!enabled || windowsStatus !== FETCH_STATUS.succeeded || !hasWindow) {
    return null;
  }

  if (allowRequests) {
    return (
      <div className="vads-u-padding-y--3 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-lighter">
        <h2 className="vads-u-font-size--h3 vads-u-margin-y--0">
          Request a new Express Care appointment
        </h2>
        <p>
          Talk to VA health care staff today about a condition or symptom that’s
          not urgent and doesn’t need emergency care. This new Express Care
          option is available today from {localWindowString}.
        </p>
        {useNewFlow ? (
          <Link
            className="usa-button"
            onClick={startNewExpressCareFlow}
            to="/new-express-care-request"
          >
            {buttonText}
          </Link>
        ) : (
          <a
            className="usa-button"
            href={legacyLink}
            target="_blank"
            rel="noreferrer nofollow"
          >
            {buttonText}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="vads-u-padding-y--3 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-lighter">
      <h2 className="vads-u-font-size--h3 vads-u-margin-y--0">
        Express Care isn’t available right now
      </h2>
      <p>
        Express Care will be available {localNextAvailableString}. Express Care
        lets you talk to VA health care staff the same day to discuss a symptom
        that’s not urgent and doesn’t need emergency care. To use Express Care,
        check back during the time shown above.
      </p>
      <button disabled>{buttonText}</button>
    </div>
  );
}
