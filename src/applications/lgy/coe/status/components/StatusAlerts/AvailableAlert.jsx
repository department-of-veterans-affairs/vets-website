import React from 'react';
import PropTypes from 'prop-types';
import { formatDateLong } from 'platform/utilities/date';

export const AvailableAlert = ({ referenceNumber, requestDate }) => (
  <va-alert status="success" class="vads-u-margin-bottom--4">
    <h2 slot="headline">You’ve been given a COE</h2>
    <div>
      <p className="vads-u-margin-bottom--0">
        You requested a COE on {requestDate && formatDateLong(requestDate)}.
      </p>
      <p className="vads-u-margin-y--0">Reference Number: {referenceNumber}</p>
    </div>
  </va-alert>
);

AvailableAlert.propTypes = {
  referenceNumber: PropTypes.string.isRequired,
  requestDate: PropTypes.string.isRequired,
};
