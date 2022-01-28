import React from 'react';

import { getAppUrl } from 'platform/utilities/registry-helpers';

import { formatDate } from '../../helpers';

const coeStatusUrl = getAppUrl('coe-status');

const getHeadline = status =>
  status === 'pending-upload'
    ? 'We need more information from you'
    : 'We’re reviewing your request';

const getBody = (status, origin) => {
  if (status === 'pending-upload') {
    return origin === 'form'
      ? 'You’ll need to upload documents before we can make a decision on your COE request.'
      : 'You’ll need to upload the documents listed on this page. Then we can make a decision on your COE request.';
  }

  return 'If you qualify for a Certificate of Eligibility, we’ll notify you by email to let you know how to get your COE.';
};

const getLinkText = status =>
  status === 'pending-upload'
    ? 'Go to your VA home loan COE page to upload documents'
    : 'Go to your VA home loan COE page to review the details of your COE';

const Pending = ({ applicationCreateDate, origin, status }) => {
  const headline = getHeadline(status);
  const requestDate = formatDate(applicationCreateDate);
  const body = getBody(status);
  const linkText = getLinkText(status);

  return (
    <va-alert status="warning">
      <h2 slot="headline">{headline}</h2>
      <p>You requested a COE on: {requestDate}</p>
      <div>
        <p>
          {body}
          {origin === 'form' && (
            <>
              <br />
              <a href={coeStatusUrl}>{linkText}</a>
            </>
          )}
        </p>
      </div>
    </va-alert>
  );
};

export default Pending;
