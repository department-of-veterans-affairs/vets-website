import React from 'react';
import PropTypes from 'prop-types';

import ReviewAndDownload from '../../../shared/components/ReviewAndDownload';
import StatusAlert from '../../../shared/components/StatusAlert';

const Eligible = ({ referenceNumber }) => (
  <>
    <StatusAlert.Eligible referenceNumber={referenceNumber} />
    <ReviewAndDownload />
    <div>
      <h2>What if my COE has errors?</h2>
      <p>
        Complete and submit a Request for a Certificate of Eligibility (VA Form
        26-1880) if you need to:
      </p>
      <ul>
        <li>
          Make changes to your COE (correct an error or update your
          information), <strong>or</strong>
        </li>
        <li>Apply for a restoration of entitlement</li>
      </ul>
    </div>
  </>
);

Eligible.propTypes = {
  referenceNumber: PropTypes.string.isRequired,
};

export default Eligible;
