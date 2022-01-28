import React from 'react';
import moment from 'moment';

import ReviewAndDownload from '../../../shared/components/ReviewAndDownload';

const Available = ({ downloadUrl, applicationCreateDate }) => (
  <>
    <va-alert status="info">
      <h2 slot="headline">You already have a COE</h2>
      <div>
        <p>
          You requested a COE on:{' '}
          {moment(applicationCreateDate).format('MMMM DD, YYYY')}
        </p>
        <p>
          You have a COE available so you don’t need to fill out a request. You
          can review the details about your COE status or download your COE now.
          <br />
          <a href="/housing-assistance/home-loans/request-coe-form-26-1880/eligibility">
            Go to your VA home loan COE page to review the details of your COE
            status
          </a>
        </p>
      </div>
    </va-alert>
    <ReviewAndDownload downloadUrl={downloadUrl} />
    <div>
      <h2>What if I need to make changes to my COE?</h2>
      <p>
        Complete and submit a Request for a Certificate of Eligibility (VA Form
        26-1880) if you need to:
      </p>
      <ul>
        <li>
          Make changes to your COE (correct an error or update your
          information), <strong>or</strong>
        </li>
        <li>Request a restoration of entitlement</li>
      </ul>
    </div>
  </>
);

export default Available;
