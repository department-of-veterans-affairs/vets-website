import React from 'react';
import PropTypes from 'prop-types';

import { formatDateLong } from 'platform/utilities/date';
import { statusUrl } from './helpers';
import { COE_ELIGIBILITY_STATUS } from '../../../constants';

const getHeadline = (status, origin) => {
  if (status === COE_ELIGIBILITY_STATUS.pending) {
    const base = 'We’re reviewing your request';
    return origin === 'form' ? base : `${base} for a COE`;
  }
  return 'We need more information from you';
};

const getBody = (status, origin) => {
  if (status === COE_ELIGIBILITY_STATUS.pendingUpload) {
    if (origin === 'form') {
      return 'You’ll need to upload documents before we can make a decision on your COE request.';
    }
    return 'You’ll need to upload the documents listed on this page. Then we can make a decision on your COE request.';
  }
  return 'If you qualify for a Certificate of Eligibility, we’ll notify you by email to let you know how to get your COE.';
};

const getLinkText = status =>
  status === COE_ELIGIBILITY_STATUS.pendingUpload
    ? 'Go to your VA home loan COE page to upload documents'
    : 'Go to your VA home loan COE page to review the details of your COE';

const Pending = ({ referenceNumber, requestDate, origin, status, testUrl }) => {
  const headline = getHeadline(status, origin);
  const body = getBody(status, origin);
  const linkText = getLinkText(status);

  return (
    <va-alert status="warning" class="vads-u-margin-bottom--2">
      <h2 slot="headline" className="vads-u-font-size--h3">
        {headline}
      </h2>
      <p>
        You requested a COE on: {requestDate && formatDateLong(requestDate)}
      </p>
      <p>
        {body}
        {origin === 'form' && (
          <>
            <br />
            <a href={testUrl || statusUrl}>{linkText}</a>
          </>
        )}
      </p>
      <p>Reference Number: {referenceNumber}</p>
    </va-alert>
  );
};

Pending.propTypes = {
  origin: PropTypes.oneOf(['form', 'status']).isRequired,
  referenceNumber: PropTypes.string.isRequired,
  requestDate: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  testUrl: PropTypes.string,
};

export default Pending;
