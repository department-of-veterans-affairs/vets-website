import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import StatusBox from '../../../shared/components/StatusBox';
import DocumentUpload from '../DocumentUpload';
import DocumentList from '../DocumentList';
import MoreQuestions from '../MoreQuestions';

const Pending = ({
  applicationCreateDate,
  notOnUploadPage,
  uploadsNeeded,
  status,
}) => {
  return (
    <div className="row vads-u-margin-bottom--7">
      <div className="medium-8 columns">
        <StatusBox.Pending
          applicationCreateDate={applicationCreateDate}
          origin={'status'}
          status={status}
        />
        {uploadsNeeded ? <DocumentUpload /> : ''}
        <DocumentList notOnUploadPage={notOnUploadPage} />
        <h2>Should I request a COE again?</h2>
        <p className="vads-u-margin-bottom--0">
          No. We’re reviewing your current request, and submitting a new request
          won’t affect our decision or speed-up the process.
        </p>
        <p>
          If more than 5 business days have passed since you submitted your
          request and you haven’t heard back, please don’t request a COE again.
          Call our toll-free number at <Telephone contact={'877-827-3702'} />.
        </p>
        <MoreQuestions />
      </div>
    </div>
  );
};

export default Pending;
