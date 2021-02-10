import React from 'react';
import { Link } from 'react-router-dom';
import { FETCH_STATUS } from '../../../utils/constants';

export default function RequestExpressCare({
  windowsStatus,
  hasWindow,
  allowRequests,
  localWindowString,
  localNextAvailableString,
  startNewExpressCareFlow,
}) {
  if (windowsStatus !== FETCH_STATUS.succeeded || !hasWindow) {
    return null;
  }

  if (allowRequests) {
    return (
      <div className="vaos-appts__card">
        <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-y--0">
          Request an Express Care appointment
        </h2>
        <p>
          You can request an Express Care appointment if you need to talk to VA
          health care staff about a non-urgent condition that doesn’t need
          emergency care. Express Care is available today from{' '}
          {localWindowString}.
        </p>
        <Link
          className="usa-button"
          onClick={startNewExpressCareFlow}
          to="/new-express-care-request"
        >
          Request Express Care
        </Link>
      </div>
    );
  }

  return (
    <div className="vaos-appts__card">
      <h2 className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-y--0">
        Express Care isn’t available right now
      </h2>
      <p>
        Express Care will be available from {localNextAvailableString}. Please
        check back during that time.
        <br />
        You can request an Express Care appointment if you need to talk to VA
        health care staff about a non-urgent condition that doesn’t need
        emergency care.
      </p>
      <button disabled>Request Express Care</button>
    </div>
  );
}
