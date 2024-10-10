import React from 'react';
import PropTypes from 'prop-types';

import StatusAlert from '../../../shared/components/StatusAlert';
import DocumentList from '../DocumentList';
import DocumentUploader from '../DocumentUploader';
import { MoreQuestions } from '../MoreQuestions';

const Pending = ({
  notOnUploadPage,
  referenceNumber,
  requestDate,
  status,
  uploadsNeeded,
}) => {
  return (
    <div className="row vads-u-margin-bottom--7">
      <div className="medium-8 columns">
        <StatusAlert.Pending
          origin="status"
          referenceNumber={referenceNumber}
          requestDate={requestDate}
          status={status}
        />
        {uploadsNeeded ? <DocumentUploader /> : ''}
        <DocumentList notOnUploadPage={notOnUploadPage} />
        <h2>Should I request a COE again?</h2>
        <p className="vads-u-margin-bottom--0">
          No. We’re reviewing your current request, and submitting a new request
          won’t affect our decision or speed up the process.
        </p>
        <p>
          If more than 5 business days have passed since you submitted your
          request and you haven’t heard back, don’t request a COE again. Call
          our toll-free number at <va-telephone contact="8778273702" />.
        </p>
        <MoreQuestions />
      </div>
    </div>
  );
};

Pending.propTypes = {
  referenceNumber: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  notOnUploadPage: PropTypes.bool,
  requestDate: PropTypes.number,
  uploadsNeeded: PropTypes.bool,
};

export default Pending;
