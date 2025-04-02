import React from 'react';
import PropTypes from 'prop-types';

import { getAppUrl } from 'platform/utilities/registry-helpers';

import ReviewAndDownload from '../../../shared/components/ReviewAndDownload';
import StatusAlert from '../../../shared/components/StatusAlert';
import { MoreQuestions } from '../MoreQuestions';

const coeUrl = getAppUrl('coe');
const introUrl = `${coeUrl}/introduction`;

const Eligible = ({ clickHandler, referenceNumber }) => (
  <div className="row vads-u-margin-bottom--7">
    <div className="medium-8 columns">
      <StatusAlert.Eligible referenceNumber={referenceNumber} />
      <ReviewAndDownload />
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
      <a
        className="vads-c-action-link--blue"
        href={introUrl}
        onClick={clickHandler}
      >
        Make changes to your COE online by filling out VA Form 26-1880
      </a>
      <MoreQuestions />
    </div>
  </div>
);

Eligible.propTypes = {
  clickHandler: PropTypes.func,
  referenceNumber: PropTypes.string,
};

export default Eligible;
