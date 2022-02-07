import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';
import moment from 'moment';
import PropTypes from 'prop-types';

import DocumentUploader from './DocumentUploader';
import { CoeDocumentList } from './CoeDocumentList';
import { MoreQuestions } from './MoreQuestions';

const getHeadline = status =>
  status === 'pending-upload'
    ? 'We need more information from you'
    : 'We’re reviewing your request for a COE';

const getBody = status =>
  status === 'pending-upload'
    ? 'You’ll need to upload the documents listed on this page. Then we can make a decision on your COE request.'
    : 'If you qualify for a Certificate of Eligibility, we’ll notify you by email to let you know how to get your COE.';

export const CoePending = ({
  applicationCreateDate,
  notOnUploadPage,
  status,
  uploadsNeeded,
}) => {
  const headline = getHeadline(status);
  const body = getBody(status);
  const requestDate = moment(applicationCreateDate).format('MMMM DD, YYYY');

  return (
    <div className="row vads-u-margin-bottom--7">
      <div className="medium-8 columns">
        <va-alert status="warning">
          <h2 slot="headline" className="vads-u-font-size--h3">
            {headline}
          </h2>
          <p>You requested a COE on: {requestDate}</p>
          <p>{body}</p>
        </va-alert>
        {uploadsNeeded ? <DocumentUploader /> : ''}
        <CoeDocumentList notOnUploadPage={notOnUploadPage} />
        <h2>Should I request a COE again?</h2>
        <p className="vads-u-margin-bottom--0">
          No. We’re reviewing your current request, and submitting a new request
          won’t affect our decision or speed up the process.
        </p>
        <p>
          If more than 5 business days have passed since you submitted your
          request and you haven’t heard back, please don’t request a COE again.
          Call our toll-free number at <Telephone contact="877-827-3702" />.
        </p>
        <MoreQuestions />
      </div>
    </div>
  );
};

CoePending.propTypes = {
  status: PropTypes.string.isRequired,
  applicationCreateDate: PropTypes.number,
  notOnUploadPage: PropTypes.bool,
  uploadsNeeded: PropTypes.bool,
};
