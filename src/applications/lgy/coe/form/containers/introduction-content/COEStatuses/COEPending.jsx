import React from 'react';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';
import moment from 'moment';
import PropTypes from 'prop-types';

import { getAppUrl } from 'platform/utilities/registry-helpers';

const coeStatusUrl = getAppUrl('coe-status');

const getHeadline = status =>
  status === 'pending-upload'
    ? 'We need more information from you'
    : 'We’re reviewing your request';

const getBody = status =>
  status === 'pending-upload'
    ? 'You’ll need to upload documents before we can make a decision on your COE request.'
    : 'If you qualify for a Certificate of Eligibility, we’ll notify you by email to let you know how to get your COE.';

const COEPending = ({ applicationCreateDate, status }) => {
  const headline = getHeadline(status);
  const requestDate = moment(applicationCreateDate).format('MMMM DD, YYYY');
  const body = getBody(status);

  return (
    <>
      <va-alert status="warning">
        <h2 slot="headline">{headline}</h2>
        <p>You requested a COE on: {requestDate}</p>
        <div>
          <p>
            {body}
            <br />
            <a href={coeStatusUrl}>
              Go to your VA home loan COE page to review the details of your COE
            </a>
          </p>
        </div>
      </va-alert>
      <div>
        <h2>Should I make a new request?</h2>
        <p>
          No. We’re reviewing your current request, and submitting a new request
          won’t affect our decision or speed up the process.
        </p>
        <p>
          If more than 5 business days have passed since you submitted your
          request and you haven’t heard back, please don’t request a COE again.
          Call our toll-free number at <Telephone contact="8778273702" />.
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
};

COEPending.propTypes = {
  status: PropTypes.string.isRequired,
  applicationCreateDate: PropTypes.number,
};

export default COEPending;
