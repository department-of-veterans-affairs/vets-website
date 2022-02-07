import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import { getAppUrl } from 'platform/utilities/registry-helpers';

const coeStatusUrl = getAppUrl('coe-status');

const COEAvailable = ({ applicationCreateDate, downloadUrl }) => (
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
    <div>
      <h2>Review and download your COE</h2>
      <p>
        You can download your COE right now. If you need help, go to our
        instructions for how to download and open a VA.gov PDF form.
        <br />
        <a href="/resources/how-to-download-and-open-a-vagov-pdf-form/">
          Get instructions for downloading a VA.gov PDF
        </a>
      </p>
    </div>
    <div className="vads-u-margin-top--4">
      <a href={downloadUrl}>
        <i
          className="fas fa-download vads-u-padding-right--1"
          aria-hidden="true"
        />
        Download your COE (PDF) 0.20MB
      </a>
    </div>
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

COEAvailable.propTypes = {
  applicationCreateDate: PropTypes.number,
  downloadUrl: PropTypes.string,
};

export default COEAvailable;
