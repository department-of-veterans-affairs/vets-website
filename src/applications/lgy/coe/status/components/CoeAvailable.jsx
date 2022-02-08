import React from 'react';
import PropTypes from 'prop-types';

import { getAppUrl } from 'platform/utilities/registry-helpers';

import { CoeDocumentList } from './CoeDocumentList';
import { MoreQuestions } from './MoreQuestions';

const coeUrl = getAppUrl('coe');
const introUrl = `${coeUrl}/introduction`;

export const CoeAvailable = ({ downloadUrl }) => (
  <div className="row vads-u-margin-bottom--7">
    <div className="medium-8 columns">
      <h2 className="vads-u-margin-top--0">Review and download your COE</h2>
      <p>
        You can download your COE right now. If you need help, go to our
        instructions for how to download and open a VA.gov PDF form.
        <br />
        <a href="/resources/how-to-download-and-open-a-vagov-pdf-form/">
          Get instructions for downloading your PDF
        </a>
      </p>
      <a
        className="vads-u-font-size--base vads-u-display--block vads-u-margin-top--4"
        href={downloadUrl}
      >
        <i
          aria-hidden="true"
          className="fas fa-download vads-u-padding-right--1"
        />
        Download your COE (PDF) 0.20MB
      </a>
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
      <a href={introUrl}>
        Make changes to your COE only by filling out VA Form 26-1880
      </a>
      <CoeDocumentList />
      <MoreQuestions />
    </div>
  </div>
);

CoeAvailable.propTypes = {
  downloadUrl: PropTypes.string.isRequired,
};
