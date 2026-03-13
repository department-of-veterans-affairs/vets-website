import React from 'react';
import PropTypes from 'prop-types';
import { formatDateLong } from 'platform/utilities/date';

export const PendingAlert = ({ referenceNumber, requestDate }) => (
  <va-alert status="info" class="vads-u-margin-bottom--4">
    <h2 slot="headline">We’re reviewing your request</h2>
    <div>
      <p className="vads-u-margin-y--0">
        You requested a COE on {requestDate && formatDateLong(requestDate)}.
      </p>
      <p className="vads-u-margin-y--0">Reference Number: {referenceNumber}</p>
      <p className="vads-u-margin-bottom--0">
        If you quality for a Certificate of Eligibility, we’ll notify you by
        email to let you know how to get your COE.
      </p>
    </div>
  </va-alert>
);

PendingAlert.propTypes = {
  referenceNumber: PropTypes.string.isRequired,
  requestDate: PropTypes.string,
};
