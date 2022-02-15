import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import { getAppUrl } from 'platform/utilities/registry-helpers';

import ReviewAndDownload from '../../../shared/components/ReviewAndDownload';

const coeStatusUrl = getAppUrl('coe-status');

const Available = ({ applicationCreateDate, downloadUrl }) => (
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
          <a href={coeStatusUrl}>
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

Available.propTypes = {
  applicationCreateDate: PropTypes.number,
  downloadUrl: PropTypes.string,
};

export default Available;
