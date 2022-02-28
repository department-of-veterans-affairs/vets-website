import React from 'react';
import PropTypes from 'prop-types';

import StatusAlert from '../../../shared/components/StatusAlert';

const Pending = ({ referenceNumber, requestDate, status }) => (
  <>
    <StatusAlert.Pending
      origin="form"
      referenceNumber={referenceNumber}
      requestDate={requestDate}
      status={status}
    />
    <div>
      <h2>Should I make a new request?</h2>
      <p>
        No. We’re reviewing your current request, and submitting a new request
        won’t affect our decision or speed up the process.
      </p>
      <p>
        If more than 5 business days have passed since you submitted your
        request and you haven’t heard back, please don’t request a COE again.
        Call our toll-free number at <va-telephone contact="8778273702" />.
      </p>
      <p>
        The only time you’d need to make a new request is if our VA home loan
        case management team recommends that you do this.
      </p>
    </div>
    <h2 className="vads-u-margin-top--6">
      Follow these steps to make another request for a VA home loan COE
    </h2>
  </>
);

Pending.propTypes = {
  referenceNumber: PropTypes.string.isRequired,
  requestDate: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
};

export default Pending;
